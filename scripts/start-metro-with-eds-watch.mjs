#!/usr/bin/env node
/**
 * Expo Go 真机预览：业务 Metro + EDS token watch（spec → build:tokens → assemble → reload）。
 * 关 watch：CREGIS_EDS_TOKEN_WATCH=0 npm start
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const consumerRoot = resolve(__dirname, '..');
const edsRoot = resolve(consumerRoot, '../eds-mobile');
const watchScript = resolve(edsRoot, 'scripts/watch-linked-consumers.mjs');
const metroPort = process.env.RCT_METRO_PORT || process.env.EXPO_DEV_SERVER_PORT || '8081';

if (process.env.CREGIS_ENSURE_EDS === '1') {
  const ensure = resolve(__dirname, 'ensure-eds-mobile.mjs');
  spawnSync(process.execPath, [ensure], { cwd: consumerRoot, stdio: 'inherit' });
}

const enableWatch =
  process.env.CREGIS_EDS_TOKEN_WATCH !== '0' &&
  existsSync(watchScript);

let watchChild;

function shutdown(code = 0) {
  if (watchChild && !watchChild.killed) {
    watchChild.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

if (enableWatch) {
  watchChild = spawn(
    process.execPath,
    [watchScript],
    {
      cwd: edsRoot,
      env: {
        ...process.env,
        EDS_CONSUMER_METRO_PORT: String(metroPort),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  watchChild.stdout?.on('data', (chunk) => process.stdout.write(chunk));
  watchChild.stderr?.on('data', (chunk) => process.stderr.write(chunk));
  watchChild.on('exit', (code) => {
    if (code && code !== 0) {
      console.warn(`[start] EDS token watch exited (${code}) — Metro continues`);
    }
  });
  console.log(
    '[start] EDS token watch → dist 变更会 reload；改 src/** 为 Fast Refresh。CREGIS_EDS_TOKEN_WATCH=0 可关闭。',
  );
} else if (!existsSync(watchScript)) {
  console.warn('[start] ../eds-mobile watch script missing — token changes need manual build:mobile + reload');
}

const expo = spawn(
  'npx',
  ['expo', 'start', '--port', String(metroPort), ...process.argv.slice(2)],
  {
    cwd: consumerRoot,
    env: process.env,
    stdio: 'inherit',
  },
);

expo.on('exit', (code) => shutdown(code ?? 1));
