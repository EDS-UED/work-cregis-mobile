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
  const result = spawnSync('pnpm', ['build:mobile'], { cwd: edsRoot, stdio: 'inherit' });
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
