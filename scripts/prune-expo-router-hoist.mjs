#!/usr/bin/env node
/**
 * @expo/cli 会把 expo-router 提升到项目根 node_modules，触发 SDK 56+「与 react-navigation 不兼容」检查。
 * 本 App 使用 React Navigation；EDS barrel 的 expo-router 子路径由 metro.config.js shim 解析。
 * 非直接依赖时删除 hoisted 包，避免 Metro 误判（见 work.md §1）。
 */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const declared = { ...pkg.dependencies, ...pkg.devDependencies };

if (declared['expo-router']) {
  process.exit(0);
}

const hoisted = join(projectRoot, 'node_modules/expo-router');
if (!existsSync(hoisted)) {
  process.exit(0);
}

rmSync(hoisted, { recursive: true, force: true });
console.log(
  '[prune-expo-router] removed hoisted expo-router (React Navigation app; EDS uses Metro shim)',
);
