/**
 * Metro — EDS linked consumer（真源：../eds-mobile/docs/consumer-metro.config.example.cjs）
 * 联调说明：../eds-mobile/docs/consumer-linked-dev.md
 *
 * 目录非 Projects/work-cregis-mobile + Projects/eds-mobile 并列时，改 edsMobileRoot。
 */
const fs = require('node:fs');
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;

const siblingEdsRoot = path.resolve(projectRoot, '../eds-mobile');
const easEdsRoot = path.resolve(projectRoot, '.eas-deps/eds-mobile');

function pickEdsMobileRoot() {
  const siblingLinked = path.join(siblingEdsRoot, 'packages/mobile/linkedMetroEntry.ts');
  if (fs.existsSync(siblingLinked)) {
    return siblingEdsRoot;
  }
  const easLinked = path.join(easEdsRoot, 'packages/mobile/linkedMetroEntry.ts');
  if (fs.existsSync(easLinked)) {
    return easEdsRoot;
  }
  return siblingEdsRoot;
}

/** Sibling eds-mobile — adjust if your layout differs */
const edsMobileRoot = pickEdsMobileRoot();
const linkedMobileEntry = path.join(edsMobileRoot, 'packages/mobile/linkedMetroEntry.ts');
const componentsRoot = path.join(edsMobileRoot, 'packages/components');
const animationsRoot = path.join(edsMobileRoot, 'packages/animations');
const tokensRoot = path.join(edsMobileRoot, 'packages/tokens');
const edsDistRoot = path.join(edsMobileRoot, 'packages/mobile/dist');
const edsComponentsDist = path.join(edsDistRoot, 'components');

/** 默认 dist（稳）；联调 EDS 源码：`CREGIS_EDS_LINKED_METRO=1 npm start` */
const useLinkedMetro =
  process.env.CREGIS_EDS_LINKED_METRO === '1' && fs.existsSync(linkedMobileEntry);

const edsDistEntries = {
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
};

const edsLinkedSubpaths = {
  '@eds-evergreen/mobile/animations': path.join(animationsRoot, 'src/index.ts'),
  '@eds-evergreen/mobile/tokens/fonts-native': path.join(
    tokensRoot,
    'dist/js/fonts-native.js',
  ),
  '@eds-evergreen/mobile/tokens/corner-smoothing': path.join(
    tokensRoot,
    'dist/js/corner-smoothing.js',
  ),
  '@eds-evergreen/mobile/tokens/liquid-glass': path.join(
    tokensRoot,
    'dist/js/liquid-glass.js',
  ),
  '@eds-evergreen/mobile/tokens': path.join(tokensRoot, 'dist/js/theme.js'),
};

const expoRouterUnstableNativeTabsShim = path.join(
  projectRoot,
  'src/shims/expo-router-unstable-native-tabs.tsx',
);
const expoGlassEffectShim = path.join(projectRoot, 'src/shims/expo-glass-effect.js');
/** RNGH 3 丢弃 stack 旧版 Pan 属性名 → 卡片手势无方向约束、抢纵向滚动。 */
const stackGestureActivationCriteriaShim = path.join(
  projectRoot,
  'src/shims/react-navigation-stack-gesture-activation-criteria.js',
);

/** 必须在 projectRoot 内，避免 dist 外链 workspace 包名解析失败。 */
const edsWorkspaceShims = {
  '@eds/mobile-animations': path.join(projectRoot, 'src/shims/eds-mobile-animations.ts'),
  '@eds/mobile-tokens/theme': path.join(projectRoot, 'src/shims/eds-mobile-tokens-theme.ts'),
  '@eds-evergreen/mobile/theme': path.join(projectRoot, 'src/shims/eds-mobile-theme.ts'),
  '@eds-evergreen/mobile/glass': path.join(projectRoot, 'src/shims/eds-mobile-glass.ts'),
  '@eds-evergreen/mobile/runtime': path.join(projectRoot, 'src/shims/eds-mobile-runtime.ts'),
  '@eds-evergreen/mobile/nav-bar': path.join(projectRoot, 'src/shims/eds-mobile-nav-bar.ts'),
  '@eds-evergreen/mobile/cregis-tab-bar': path.join(projectRoot, 'src/shims/eds-mobile-cregis-tab-bar.ts'),
  '@eds-evergreen/mobile/button-glass': path.join(projectRoot, 'src/shims/eds-mobile-button-glass.ts'),
  '@eds-evergreen/mobile/home-ui': path.join(projectRoot, 'src/shims/eds-mobile-home-ui.ts'),
  '@eds-evergreen/mobile/sheets': path.join(projectRoot, 'src/shims/eds-mobile-sheets.ts'),
  '@eds-evergreen/mobile/profile-icons': path.join(projectRoot, 'src/shims/eds-mobile-profile-icons.ts'),
  '@eds-evergreen/mobile/menu': path.join(projectRoot, 'src/shims/eds-mobile-menu.ts'),
};

const consumerNodeModules = path.resolve(projectRoot, 'node_modules');

/** 单实例 RN / Reanimated / Worklets（避免 pnpm 嵌套 0.10.x 与 Reanimated 4.7 冲突）。 */
function buildConsumerPeerExtraNodeModules() {
  const extra = {
    '@eds/mobile-animations': animationsRoot,
    '@eds/mobile-tokens': tokensRoot,
  };
  const alwaysPin = [
    'react',
    'react-native',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-native-svg',
    'react-native-worklets',
    'expo-glass-effect',
  ];
  for (const name of alwaysPin) {
    const dir = path.join(consumerNodeModules, name);
    if (fs.existsSync(dir)) {
      extra[name] = dir;
    }
  }
  let deps = {};
  try {
    deps =
      JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')).dependencies ??
      {};
  } catch {
    /* ignore */
  }
  for (const name of Object.keys(deps)) {
    if (extra[name]) {
      continue;
    }
    const dir = path.join(consumerNodeModules, name);
    if (fs.existsSync(dir)) {
      extra[name] = dir;
    }
  }
  return extra;
}

const config = getDefaultConfig(projectRoot);

const { FileStore } = require('metro-cache');
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

if (useLinkedMetro) {
  config.watchFolders = [
    projectRoot,
    componentsRoot,
    animationsRoot,
    tokensRoot,
    path.join(edsMobileRoot, 'packages/mobile'),
  ];
  config.resolver.nodeModulesPaths = [consumerNodeModules];
  config.resolver.extraNodeModules = buildConsumerPeerExtraNodeModules();
  config.resolver.disableHierarchicalLookup = true;
} else {
  // dist（Expo Go 默认）：file: → packages/mobile/dist；监听 dist 子目录以便 token assemble 后真机能拉新 theme.js
  // `@eds/mobile-tokens/liquid-glass` 等 resolver 指向 packages/tokens/dist — 须纳入 watchFolders，否则 SHA-1 失败、红屏。
  // 仅监听 assemble 产物（token watch → dist/tokens）；少扫整棵 components 树，加快 reload。
  config.watchFolders = [
    projectRoot,
    path.join(edsDistRoot, 'tokens'),
    path.join(edsDistRoot, 'components'),
    path.join(tokensRoot, 'dist'),
    path.join(animationsRoot, 'dist'),
  ];
  config.resolver.nodeModulesPaths = [consumerNodeModules];
  config.resolver.extraNodeModules = buildConsumerPeerExtraNodeModules();
  config.resolver.disableHierarchicalLookup = true;
}

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'import', 'require', 'default'];

function resolveRelativeJsToTs(context, moduleName) {
  if (!moduleName.endsWith('.js') || !moduleName.startsWith('.')) {
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

/** `tsconfig` paths：`@/*` → `src/*` */
function resolveProjectAlias(moduleName) {
  if (!moduleName.startsWith('@/')) {
    return null;
  }
  const rel = moduleName.slice(2);
  const base = path.join(projectRoot, 'src', rel);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return { type: 'sourceFile', filePath };
    }
  }
  return null;
}

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const workspaceShim = edsWorkspaceShims[moduleName];
  if (workspaceShim && fs.existsSync(workspaceShim)) {
    return { type: 'sourceFile', filePath: workspaceShim };
  }

  if (moduleName === '@eds/mobile-tokens/liquid-glass') {
    const liquidGlass = path.join(tokensRoot, 'dist/js/liquid-glass.js');
    if (fs.existsSync(liquidGlass)) {
      return { type: 'sourceFile', filePath: liquidGlass };
    }
  }

  if (moduleName === 'react-native-reanimated' || moduleName === 'react-native-worklets') {
    const pkgDir = path.join(consumerNodeModules, moduleName);
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const mainRel = pkg.main ?? 'index.js';
      const mainPath = path.join(pkgDir, mainRel);
      if (fs.existsSync(mainPath)) {
        return { type: 'sourceFile', filePath: mainPath };
      }
    }
  }

  if (
    moduleName.endsWith('/utils/gestureActivationCriteria.js') &&
    context.originModulePath.includes(
      `${path.sep}@react-navigation${path.sep}stack${path.sep}`,
    )
  ) {
    return { type: 'sourceFile', filePath: stackGestureActivationCriteriaShim };
  }

  if (moduleName === 'expo-router/unstable-native-tabs') {
    return { type: 'sourceFile', filePath: expoRouterUnstableNativeTabsShim };
  }

  if (
    moduleName === 'expo-glass-effect' &&
    platform === 'ios' &&
    !context.originModulePath.includes(`${path.sep}src${path.sep}shims${path.sep}expo-glass-effect`)
  ) {
    return { type: 'sourceFile', filePath: expoGlassEffectShim };
  }

  const fromBusinessSrc =
    context.originModulePath.includes(`${path.sep}src${path.sep}`) &&
    !context.originModulePath.includes(`${path.sep}src${path.sep}shims${path.sep}`);

  if (moduleName === '@eds-evergreen/mobile' && fromBusinessSrc && !useLinkedMetro) {
    throw new Error(
      '[EDS] 禁止从 @eds-evergreen/mobile 主入口 import（会拉全量组件）。请用 @eds-evergreen/mobile/nav-bar、/home-ui、/theme 等细分子路径。',
    );
  }

  if (moduleName === '@eds-evergreen/mobile') {
    if (useLinkedMetro) {
      if (!fs.existsSync(linkedMobileEntry)) {
        throw new Error(
          '[EDS] missing linkedMetroEntry; check edsMobileRoot or CREGIS_EDS_LINKED_METRO=0',
        );
      }
      return { type: 'sourceFile', filePath: linkedMobileEntry };
    }
    // 默认 dist：交给 node_modules `@eds-evergreen/mobile`（file:）与 package exports
  } else if (useLinkedMetro) {
    const subEntry = edsLinkedSubpaths[moduleName];
    if (subEntry && fs.existsSync(subEntry)) {
      return { type: 'sourceFile', filePath: subEntry };
    }
  }

  const projectAlias = resolveProjectAlias(moduleName);
  if (projectAlias) {
    return projectAlias;
  }

  const relativeTs = resolveRelativeJsToTs(context, moduleName);
  if (relativeTs) {
    return relativeTs;
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
