#!/usr/bin/env node
/**
 * Ensure @eds-evergreen/mobile dist exists before Expo (tokens + components + animations).
 */
import { existsSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const consumerRoot = resolve(__dirname, '..');
const edsRoot = resolve(consumerRoot, '../eds-mobile');
const assembledMarker = join(edsRoot, 'packages/mobile/dist/index.js');

if (process.env.CREGIS_ENSURE_EDS === '0') {
  console.log('[ensure-eds-mobile] skip (CREGIS_ENSURE_EDS=0)');
  process.exit(0);
}

/**
 * jojo 使用 GitHub 上的 eds-mobile `main`，不用本机被删过图标的工作区。
 * 本地改动先 stash，再 fast-forward。构建时不从 desktop 覆盖图标，避免删掉库里已有的 svg。
 */
function alignEdsCheckoutToOriginMain() {
  const fetch = spawnSync('git', ['fetch', 'origin'], {
    cwd: edsRoot,
    encoding: 'utf8',
  });
  if ((fetch.status ?? 1) !== 0) {
    console.warn('[ensure-eds-mobile] git fetch failed; building the local checkout');
    console.warn((fetch.stderr || fetch.stdout || '').trim());
    return;
  }

  const porcelain = spawnSync('git', ['status', '--porcelain'], {
    cwd: edsRoot,
    encoding: 'utf8',
  });
  if ((porcelain.stdout || '').trim()) {
    console.warn(
      '[ensure-eds-mobile] stashing local eds-mobile changes so this app uses origin/main',
    );
    const stash = spawnSync(
      'git',
      ['stash', 'push', '-u', '-m', 'ensure-eds-mobile: local changes before origin/main'],
      { cwd: edsRoot, encoding: 'utf8' },
    );
    if ((stash.status ?? 1) !== 0) {
      console.warn((stash.stderr || stash.stdout || '').trim());
    }
  }

  const pull = spawnSync('git', ['pull', '--ff-only', 'origin', 'main'], {
    cwd: edsRoot,
    encoding: 'utf8',
  });
  if ((pull.status ?? 1) !== 0) {
    console.warn('[ensure-eds-mobile] eds-mobile is not a fast-forward of origin/main');
    console.warn((pull.stderr || pull.stdout || '').trim());
    return;
  }
  const note = (pull.stdout || '').trim();
  if (note) console.log(`[ensure-eds-mobile] ${note}`);
}

alignEdsCheckoutToOriginMain();

const edsSrcGlobs = [
  'packages/tokens/spec',
  'packages/components/src',
  'packages/animations/src',
];

/** `git ls-files` 比全树 walk 快一个数量级（仅跟踪文件）。 */
function newestMtimeViaGit() {
  const gitRoot = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: edsRoot,
    encoding: 'utf8',
  });
  if ((gitRoot.status ?? 1) !== 0) return null;

  const root = gitRoot.stdout.trim();
  if (!root) return null;

  const listed = spawnSync('git', ['ls-files', ...edsSrcGlobs], {
    cwd: root,
    encoding: 'utf8',
  });
  if ((listed.status ?? 1) !== 0) return null;

  let newest = 0;
  for (const rel of listed.stdout.split('\n')) {
    const trimmed = rel.trim();
    if (!trimmed) continue;
    if (!/\.(ts|tsx|js|mjs|json)$/.test(trimmed)) continue;
    const full = join(root, trimmed);
    if (!existsSync(full)) continue;
    const mtime = statSync(full).mtimeMs;
    if (mtime > newest) newest = mtime;
  }
  return newest;
}

function newestMtime(root) {
  if (!existsSync(root)) return 0;
  let newest = statSync(root).mtimeMs;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        stack.push(full);
        continue;
      }
      if (!/\.(ts|tsx|js|mjs|json)$/.test(entry.name)) continue;
      const mtime = statSync(full).mtimeMs;
      if (mtime > newest) newest = mtime;
    }
  }
  return newest;
}

function maxEdsSrcMtime() {
  const viaGit = newestMtimeViaGit();
  if (viaGit != null) return viaGit;
  const srcRoots = edsSrcGlobs.map((rel) => join(edsRoot, rel));
  return Math.max(0, ...srcRoots.map((root) => newestMtime(root)));
}

function needsBuild() {
  if (!existsSync(assembledMarker)) return true;
  const distMtime = statSync(assembledMarker).mtimeMs;
  return maxEdsSrcMtime() > distMtime;
}

function linkedMobileDistPath() {
  const linkPath = join(consumerRoot, 'node_modules/@eds-evergreen/mobile/dist/index.js');
  if (!existsSync(linkPath)) return null;
  try {
    return realpathSync(linkPath);
  } catch {
    return null;
  }
}

/** pnpm `file:` 会在 store 里留拷贝；仅 build eds 不会更新 Metro 实际 resolve 的路径。 */
function pnpmCopyStale() {
  const linked = linkedMobileDistPath();
  if (!linked || !existsSync(assembledMarker)) return Boolean(!linked);
  if (linked.startsWith(join(edsRoot, 'packages/mobile'))) return false;
  return statSync(assembledMarker).mtimeMs > statSync(linked).mtimeMs;
}

const staleCopy = pnpmCopyStale();
const mustBuild = needsBuild();

if (!mustBuild && !staleCopy) {
  console.log('[ensure-eds-mobile] skip (@eds-evergreen/mobile dist up to date)');
  process.exit(0);
}

if (mustBuild) {
  console.log('[ensure-eds-mobile] building EDS Mobile (tokens · animations · components · assemble)…');
  const result = spawnSync('pnpm', ['build:mobile'], {
    cwd: edsRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      // desktop 图标目录比 mobile 少文件；同步会删掉 GitHub 上已有的图标（如 eds-camera-1）。
      EDS_DESKTOP_ROOT: join(edsRoot, '.no-desktop-icon-sync'),
    },
  });
  if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
}

if (staleCopy) {
  const linked = linkedMobileDistPath();
  const liveLink = linked?.startsWith(join(edsRoot, 'packages/mobile'));
  if (liveLink) {
    console.log('[ensure-eds-mobile] live file: link — dist build is sufficient');
  } else {
    console.warn(
      '[ensure-eds-mobile] pnpm 的 file: 依赖可能是 store 拷贝，与 eds-mobile/dist 不同步。请在本项目执行 `CI=true pnpm install` 或改用 npm（file: 直连源码）。',
    );
  }
}

process.exit(0);
