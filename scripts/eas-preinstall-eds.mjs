#!/usr/bin/env node
/**
 * EAS Build / Update：云端没有 sibling ../eds-mobile 时，clone EDS 并 build dist，
 * 再把 @eds-evergreen/mobile 指到 file:.eas-deps/eds-mobile/packages/mobile。
 *
 * 本地同级目录已有 dist 时跳过。
 *
 * Secrets（Expo Dashboard → EAS → Environment variables）：
 * - GITHUB_PAT：eds-mobile 为 private 时必填（repo read）
 * - EDS_MOBILE_GIT_REF：可选，默认 main
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const consumerRoot = join(__dirname, '..');
const siblingEdsRoot = join(consumerRoot, '..', 'eds-mobile');
const siblingDist = join(siblingEdsRoot, 'packages/mobile/dist/index.js');
const easEdsRoot = join(consumerRoot, '.eas-deps', 'eds-mobile');
const easDist = join(easEdsRoot, 'packages/mobile/dist/index.js');
const packageJsonPath = join(consumerRoot, 'package.json');

const EDS_REMOTE = 'github.com/EDS-UED/eds-mobile.git';
const edsRef = process.env.EDS_MOBILE_GIT_REF ?? 'main';
const edsFileDep = 'file:.eas-deps/eds-mobile/packages/mobile';

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function cloneUrl() {
  const pat = process.env.GITHUB_PAT?.trim();
  if (pat) {
    return `https://${pat}@github.com/EDS-UED/eds-mobile.git`;
  }
  return `https://github.com/EDS-UED/eds-mobile.git`;
}

function patchEdsDependency(toFileDep) {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const current = pkg.dependencies?.['@eds-evergreen/mobile'];
  if (current === toFileDep) {
    return;
  }
  pkg.dependencies['@eds-evergreen/mobile'] = toFileDep;
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`[eas-preinstall-eds] @eds-evergreen/mobile → ${toFileDep}`);
}

function shouldRunOnEas() {
  if (process.env.EAS_FETCH_EDS === '1') return true;
  if (process.env.EAS_BUILD === 'true') return true;
  if (process.env.EAS_BUILD_RUNNER) return true;
  if (process.env.CI === 'true' || process.env.CI === '1') return true;
  return false;
}

if (existsSync(siblingDist)) {
  console.log('[eas-preinstall-eds] skip (local ../eds-mobile dist present)');
  process.exit(0);
}

if (!shouldRunOnEas()) {
  console.log(
    '[eas-preinstall-eds] skip (no local eds-mobile; set EAS_FETCH_EDS=1 on EAS to clone)',
  );
  process.exit(0);
}

console.log(`[eas-preinstall-eds] fetching eds-mobile @ ${edsRef}…`);

const depsDir = join(consumerRoot, '.eas-deps');
mkdirSync(depsDir, { recursive: true });
if (existsSync(easEdsRoot)) {
  rmSync(easEdsRoot, { recursive: true, force: true });
}

run('git', [
  'clone',
  '--depth',
  '1',
  '--branch',
  edsRef,
  cloneUrl(),
  easEdsRoot,
]);

run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: easEdsRoot });
run('pnpm', ['build:mobile'], { cwd: easEdsRoot });

if (!existsSync(easDist)) {
  console.error('[eas-preinstall-eds] build failed: dist/index.js missing');
  process.exit(1);
}

patchEdsDependency(edsFileDep);
console.log('[eas-preinstall-eds] ready');
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot });
run('node', ['scripts/prune-expo-router-hoist.mjs'], { cwd: consumerRoot });
