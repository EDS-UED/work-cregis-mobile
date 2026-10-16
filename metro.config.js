const fs = require('node:fs');
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve: resolveRequest } = require('metro-resolver');

const projectRoot = __dirname;
const edsMobileRoot = path.resolve(projectRoot, '../eds-mobile');
/** Assembled @eds-evergreen/mobile — consumer 只认这一份 dist。 */
const edsDistRoot = path.resolve(edsMobileRoot, 'packages/mobile/dist');
const edsComponentsDist = path.join(edsDistRoot, 'components');

const edsEntries = {
  '@eds-evergreen/mobile': path.join(edsDistRoot, 'index.js'),
  '@eds-evergreen/mobile/animations': path.join(edsDistRoot, 'animations/index.js'),
  '@eds-evergreen/mobile/components': path.join(edsComponentsDist, 'index.js'),
  '@eds-evergreen/mobile/tokens': path.join(edsDistRoot, 'tokens/js/theme.js'),
  '@eds-evergreen/mobile/tokens/corner-smoothing': path.join(
    edsDistRoot,
    'tokens/js/corner-smoothing.js',
  ),
  '@eds-evergreen/mobile/tokens/fonts-native': path.join(
    edsDistRoot,
    'tokens/js/fonts-native.js',
  ),
  '@eds-evergreen/mobile/tokens/liquid-glass': path.join(
    edsDistRoot,
    'tokens/js/liquid-glass.js',
  ),
  '@eds/mobile-components': path.join(edsComponentsDist, 'index.js'),
  '@eds/mobile-animations': path.join(edsDistRoot, 'animations/index.js'),
  '@eds/mobile-tokens/theme': path.join(edsDistRoot, 'tokens/js/theme.js'),
  '@eds/mobile-tokens/fonts-native': path.join(edsDistRoot, 'tokens/js/fonts-native.js'),
  '@eds/mobile-tokens/corner-smoothing': path.join(
    edsDistRoot,
    'tokens/js/corner-smoothing.js',
  ),
  '@eds/mobile-tokens/liquid-glass': path.join(edsDistRoot, 'tokens/js/liquid-glass.js'),
};

const config = getDefaultConfig(projectRoot);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

/** 只监听 assemble dist，避免扫整个 eds-mobile 拖慢 Metro / 真机 Loading %。 */
config.watchFolders = [edsDistRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(edsMobileRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enableSymlinks = true;

/** 禁止 Metro 落到 eds-mobile 源码树（避免 dist 相对 import 被错绑到 src）。 */
const edsComponentsSrc = path.join(edsMobileRoot, 'packages/components/src');
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  new RegExp(`${edsComponentsSrc.replace(/[/\\]/g, '[/\\\\]')}[/\\\\].*`),
];

function isEdsAssembledComponentsModule(originModulePath) {
  const normalized = path.normalize(originModulePath);
  return normalized.includes(`${path.sep}packages${path.sep}mobile${path.sep}dist${path.sep}components${path.sep}`);
}

/** assemble dist 内 `*.js` 相对路径 — symlink/file: 包在 disableHierarchicalLookup 下需显式解析。 */
function resolveEdsAssembledRelative(context, moduleName) {
  if (!moduleName.startsWith('.')) {
    return null;
  }
  if (!isEdsAssembledComponentsModule(context.originModulePath)) {
    return null;
  }

  const originDir = path.dirname(context.originModulePath);
  const resolved = path.normalize(path.resolve(originDir, moduleName));

  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    return { type: 'sourceFile', filePath: resolved };
  }

  if (moduleName.endsWith('.js')) {
    const withoutExt = resolved.slice(0, -3);
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
      const candidate = `${withoutExt}${ext}`;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return { type: 'sourceFile', filePath: candidate };
      }
    }
  }

  return null;
}

function resolveRelativeJsToTs(context, moduleName) {
  if (!moduleName.endsWith('.js') || !moduleName.startsWith('.')) {
    return null;
  }

  if (isEdsAssembledComponentsModule(context.originModulePath)) {
    return null;
  }

  const originDir = path.dirname(context.originModulePath);
  const absBase = path.resolve(originDir, moduleName.slice(0, -3));

  for (const ext of ['.ts', '.tsx']) {
    const candidate = `${absBase}${ext}`;
    if (fs.existsSync(candidate)) {
      return { type: 'sourceFile', filePath: candidate };
    }
  }

  return null;
}

/** Expo Router 子路径 — 仅 EDS barrel 静态依赖；业务导航见 RootTabNavigator（React Navigation）。 */
const expoRouterUnstableNativeTabsShim = path.join(
  projectRoot,
  'src/shims/expo-router-unstable-native-tabs.tsx',
);

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-router/unstable-native-tabs') {
    return { type: 'sourceFile', filePath: expoRouterUnstableNativeTabsShim };
  }

  const edsEntry = edsEntries[moduleName];
  if (edsEntry && fs.existsSync(edsEntry)) {
    return { type: 'sourceFile', filePath: edsEntry };
  }

  const edsRelative = resolveEdsAssembledRelative(context, moduleName);
  if (edsRelative) {
    return edsRelative;
  }

  const relativeTs = resolveRelativeJsToTs(context, moduleName);
  if (relativeTs) {
    return relativeTs;
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }

  return resolveRequest(context, moduleName, platform);
};

module.exports = config;
