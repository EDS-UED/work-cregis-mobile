/**
 * GitHub Pages 构建链：expo export (web) → 404.html → .nojekyll
 * CI 须设置 EXPO_BASE_URL=/work-cregis-mobile/（workflow 按仓库名注入）
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, writeFileSync } from 'node:fs';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'work-cregis-mobile';
const baseUrl = process.env.EXPO_BASE_URL ?? `/${repoName}/`;

const env = {
  ...process.env,
  EXPO_BASE_URL: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
};

function run(command, args) {
  const result = spawnSync(command, args, {
    env,
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Building Pages artifact with EXPO_BASE_URL=${env.EXPO_BASE_URL}`);

run('npx', ['expo', 'export', '-p', 'web', '--output-dir', 'dist']);
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');

console.log('Pages artifact ready at dist/');
