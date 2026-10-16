---
description: work-cregis-mobile 唯一业务规范 — Mobile App、EDS 边界、i18n、Native 开发
globs: **/*
alwaysApply: true
---

# work-cregis-mobile 业务集成规范

> **项目**：Cregis Mobile（RN + Expo · iOS / Android · Native only）。  
> **入口**：改代码前先读本文件；详案见 `docs/cregis-mobile-project-brief.md`。  
> **EDS 权威**：`../eds-mobile/.cursor/rules/work.mdc`、`packages/tokens/spec/**`。  
> **与 Desktop**：业务架构**完全独立**；仅可参考 `work-cregis-desktop` 的**交互模型**，不得复制其 CSS / token / 源码。

## 30 秒读懂

```text
业务 UI     → src/scenes/**     用 Eg* + useEdsTheme() + i18n
设计系统    → ../eds-mobile/**   本仓库禁止改；缺能力先问用户
EDS preview → playground（模拟器/真机）；禁止 Web preview
一套代码    → 同一份 Scene 跑 iOS / Android，禁止第二套 UI
```

---

## Agent 协作方式

**过程中**：每个动作（读、搜、改、验）动手前或同时一两句——为什么、依据哪条 §、边界（改什么 / 不改什么）。**禁止**闷头改完再汇报；**禁止**五段式模板。

**任务边界（默认）**

| 用户说了什么 | Agent 做什么 |
|--------------|--------------|
| 只提业务 Scene / 功能 | 只改 `src/**`（及 i18n / navigation / store） |
| 只提 token / Eg 组件行为 | **禁止改** `../eds-mobile/**`；告知属 EDS，请用户在 eds-mobile 改完再同步（§3.1） |

**收尾**：两三句——做了什么、还需什么、验证过没过。**禁止**复述全过程。

**心里有数**：含 EDS 改动 → 远程 eds-mobile 已推 + CI pin 一致（§3.3）。区分「本次引入」与「预先存在」。

---

## 0. 速查索引

| 主题 | 章节 |
|------|------|
| Agent 协作 | 文首 |
| 目录该改哪 | §0.1 |
| Expo / 命令 | §1 |
| EDS 消费、组件/token | §2 |
| EgButtonGlass iOS 26 内边距 | §2.4 |
| 仓库边界、dev、Git/pin | §3 |
| i18n | §4 |
| 原生 vs RN、Eg* 边界 | §2.3 |
| 样式、滚动、网络名称 | §5 |
| Modal / Sheet 生命周期 | §6 |
| Native 开发与 EDS preview 分工 | §7 |
| Motion | §8 |
| 校验与 PR | §9 |
| 文件索引 | §10 |

### 0.1 目录边界

| 路径 | 职责 | Agent 何时改 |
|------|------|--------------|
| `src/scenes/**` | 五 Tab 业务页 | 业务需求 |
| `src/navigation/**` | Tab + Stack | 路由 / 转场 |
| `src/store/**` | Zustand 域状态 | 跨页共享态 |
| `src/hooks/**` | 流程编排、ephemeral UI | 弹窗步骤、动画 progress |
| `src/services/**` | Mock / Native adapter | API、Biometrics 等 |
| `src/i18n/**` | 文案 catalog | 任何 UI 固定文案 |
| `App.tsx` | 根挂载 | GHRootView、SafeAreaProvider |
| `../eds-mobile/**` | 设计系统 | **禁止**在本任务里改（除非用户明确改 EDS） |

**不存在** `src/components/` · `src/theme/` · `src/motion/presets.ts`——UI 用 Eg*，主题用 EDS。

---

## 1. Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any Expo / RN API code.

| 通道 | 命令 | 用途 |
|------|------|------|
| Native | `npm start` · `npm run ios` · `npm run android` | **业务主战场** — Scene / 流程 / 集成 |
| EDS 组件 preview | `../eds-mobile` · `pnpm dev:playground` | **EDS 职责** — 模拟器/真机；非本仓库 |

**【禁止】** Web preview（Browser / Pages / showcase / rn-preview）；**【禁止】** 为 Browser 单独写一套 Scene 或动效。

**React Navigation · 勿装 expo-router**

本 App 导航为 **React Navigation**（非 Expo Router）。`npm install` 会把 `@expo/cli` 依赖的 **expo-router 提升到根 `node_modules`**，Metro SDK 56+ 会误报「expo-router 与 react-navigation 不兼容」红屏。

| 机制 | 说明 |
|------|------|
| `postinstall` → `scripts/prune-expo-router-hoist.mjs` | 非直接依赖时删除 hoisted `expo-router` |
| `metro.config.js` shim | `expo-router/unstable-native-tabs` → `src/shims/…`（EDS barrel 静态引用，运行时不走 Expo Router） |
| **【禁止】** 安装 `expo-router` 作业务依赖 | 与 RN Navigation 冲突；勿用 `EXPO_ROUTER_DISABLE_*` 代替 prune（除非 Expo 仍误判） |

`npm install` / 同步 EDS 后若仍红屏：**删 hoisted 包后必须重启 Metro `--clear`**（旧进程会缓存误判）。

---

## 2. 设计系统消费（强制）

### 2.1 Mobile-only

**【必须】** 设计系统**只依赖本地仓库** `../eds-mobile`，经 **`file:` 链接** 的 `@eds-evergreen/mobile`（`file:../eds-mobile/packages/mobile`）消费 assemble `dist`（tokens + animations + components 全量资产）。启动前 `ensure-eds-mobile.mjs` 会在 dist 过期时跑 `pnpm build:mobile`。

**【禁止】** 在 `package.json` 里把 `@eds-evergreen/mobile` 写成 npm registry 版本（如 `"^0.1.0"`、`npm install @eds-evergreen/mobile`）——**npm 上的包是对外发布物**；Cregis 开发/集成阶段**只用本地 eds-mobile**，不跟 registry pin。

```ts
import { EgCregisTabBar, getThemeColors, mobileTheme } from '@eds-evergreen/mobile';
import { mobileMotion } from '@eds-evergreen/mobile/animations';
// Web preview 圆角：@eds-evergreen/mobile/tokens/corner-smoothing
// Token CSS / JSON：@eds-evergreen/mobile/tokens/css · /tokens/json · /tokens/liquid-glass 等
```

**【禁止】**

| 项 | 原因 |
|----|------|
| `@eds/mobile-*`  workspace 包名直接 import | 须经 `@eds-evergreen/mobile` 或 Metro 解析到其 `dist` |
| `@eds/desktop-*` · `@eds/website-*` | 体系不同 |
| 复制 `work-cregis-desktop/**` 的 CSS / shell-debug / token 名 | 平台分离 |
| 复制已删除的 Web preview 集成方式 | EDS preview = playground；consumer = Native |
| `import '.../eds-mobile/packages/.../src'` 绕过 assemble | 破坏 consumer 边界 |
| consumer 私造 color / spacing / motion token | 缺了先问用户 |

Token 真源：`../eds-mobile/packages/tokens/spec/**`。

### 2.2 运行时怎么取 token

**【必须】** 业务 Scene 统一：

```ts
const { colors, spacing, typography } = useEdsTheme();
// 数值 token → px
padding: edsPx(spacing['spacing-4']),
color: colors['text-base-primary'],
fontSize: edsPx(typography['size-body-medium']),
fontWeight: String(typography['weight-semibold']) as '600',
```

**【禁止】**

```ts
color: '#1fc35a'           // hex
padding: 16                // 魔法数
fontWeight: '600'          // 未走 typography token
withSpring(0, { damping: 18 })  // 硬编码 spring
```

**【禁止】** 给 `EgCregisTabBar` 等 **根组件** 外加 `style` 改尺寸/颜色；需要变体 → EDS 加 prop 或换场景组件。

**【必须】** 有场景封装就用场景入口（`EgCregisTabBar`），**禁止**手搓平行 TabBar / Button / Sheet。

**【禁止】** 业务侧覆盖场景组件 preset（例如给 `EgCregisTabBar` 传自定义 `items` / 改 Tab 文案·图标）。React Navigation 绑定只用 `createEgCregisTabBarBottomTabsBinding(state, navigation)`；Tab 文案以 DS `CREGIS_TAB_BAR_ITEMS` 为准。

**【必须】** `RootTabParamList` / `Tab.Screen name` 与 DS `CREGIS_TAB_BAR_ITEMS[].routeName` **逐字一致**（如 `Home`、`Collaboration`、`Assets`、`Waas`、`Profile`）；改 Tab 结构先改 eds-mobile preset，再改导航。

**【必须】** 顶栏用 `EgNavBar` / `egNavBarNativeStackOptions`（`SceneScaffold`），`background: 'auto'` + `useEgNavBarScroll`；Tab 根页 `showNavBack` 默认 false。

### 2.3 原生 vs RN（强制）

**仅**下列 EDS 组件允许走平台原生增强（Liquid Glass、系统 Nav/Tab 等）——分支在 **EDS 内部**，业务 **不得** 另接 UIKit / 系统 API：

| 组件 | 业务侧用法 |
|------|------------|
| **EgNavBar** | iOS 26+：**栏背景继承原生** — Stack 用 `egNavBarNativeStackScreenOptions`（`background: 'auto'` → `scrollEdgeEffects.top`，与 Showcase 一致），`headerTransparent` + `contentStyle`/`ScrollView` 为 `box-page`；**禁止**自绘 Nav 底或 RN `EgNavBar` 叠在系统栏上。自定义左右（Home）用 `unstable_header*Items` + `EgButtonGlassNav*`，`Stack.Screen options` **首帧**下发。**设计无标题时**：`egNavBarNativeStackOptions({ title: 真实文案, showTitle: false })`，由 EDS 保证非空并透明隐藏（iOS 26 空标题会使 scroll edge 栏背景失效）；业务侧**勿**再手写 `headerTitleStyle` 透明覆盖。验收 scroll edge 时页面内容须超过一屏。主列表 **勿**包 `EdsGlassScreenShell`；`ScrollView` + `contentInsetAdjustmentBehavior="automatic"` 作 scroll edge 采样面。Android / iOS ≤25：RN `EgNavBar` + `EdsGlassScreenShell` + `useEgNavBarScroll`（见 `HomeTopBar` / `SceneScaffold`） |
| **EgTabBar** / **EgCregisTabBar** | `CregisTabBar` 或 iOS 26+ `egCregisTabBarNativeBottomTabsScreenOptions` |
| **EgGlass** | 仅通过 EDS 组件间接出现，业务不手搓 blur 壳 |
| **EgButtonGlass**（EgGlassButton） | 见 **§2.4**；iOS 26 **Nav 自定义项**只放内容（Avatar / Symbol 等），**禁止**再包 `EgButtonGlassNav*`（其 RN inset 会与系统 ~4pt 叠成「偏胖一圈」）；栏项间距用内容 `margin`/`gap`，勿 `unstable_header*Items` 的 `spacing` 类型补偿 |

### 2.4 EgButtonGlass 内边距（iOS 26+ 必知）

**【必须】** 业务继续用 `EgButtonGlass`，**禁止**为「对齐设计稿」在 iOS 26+ 外包一层 `View` padding / margin；**禁止**传已移除的 `forceRnImplementation`。对照 RN 效果只看 EDS showcase 的 **preview 对照开关**，不是业务 API。

| 栈 | 内边距来源 |
|----|------------|
| **iOS 26+ 原生 Liquid Glass** | **仅系统材质 inset（约 4pt）**；EDS 不再叠 RN 的 `spacing-1` / `spacing-4` / EgButton 文本 padding（避免 4+4「偏胖一圈」） |
| **Android / iOS ≤25** | RN 路径不变：icon → `spacing-1`；双 icon → `spacing-4`；文本 → 与 EgButton 同档 |

头像槽：`avatarSlot` + `EgAvatar size="lg"`。联调验收：圆形 icon、双 icon / 头像槽、文本胶囊与 showcase **同配置真机**一致。

**【必须】** 上表以外 **全部 RN 技术栈**：`View` · `ScrollView` · `FlatList` · `Pressable` · `StyleSheet` · `SceneText` · Zustand · i18n；尺寸/色用 `useEdsTheme()` + `edsPx()` + `edsPageBackground()` 等 helper。

**【禁止】**

- 业务手写 `GlassInteraction` + `EgGlass` 拼玻璃按钮（须 `EgButtonGlass`）
- Native Stack 的 `headerLeft` / `headerRight` 塞 RN 自定义头（iOS 26 不稳定；自定义头 → 浮动 RN 层 + `EgButtonGlass`）
- NativeWind、第三方 UI kit、业务层直接包 `expo-glass-effect` / `BlurView`（页面 Android 模糊采样仅允许 **`GlassBlurScope` + `GlassBlurBackdrop` + `EdsGlassScreenShell`**，与 EDS Showcase 一致）
- 为「像原生」复制第二套 Platform 分支 UI（同一 Scene 只一套 RN 布局）

**【必须】** 页面背景全局 **`box-page`**（`edsPageBackground(colors)` ↔ CSS `var(--box-page)`）。

---

## 3. 仓库边界与工程

### 3.1 EDS ↔ 业务单向边界

| 本仓库可改 | 禁止改 |
|------------|--------|
| `src/**` · `docs/**` | `../eds-mobile/**`（整个设计系统仓库） |

**【禁止】业务侧 / 本仓库 Agent 更改 EDS 设计系统**，包括但不限于：

| 禁止行为 | 说明 |
|----------|------|
| 改 `../eds-mobile/**` 任意文件 | 组件、token、脚本、showcase、规则等 — **一律不在本任务里动** |
| 为修 Eg* / token 在 consumer 里「顺手改 EDS」 | 缺能力 → **停改**，说明属 eds-mobile，请用户在 **eds-mobile** 改完并 build |
| 手改 `node_modules/@eds-evergreen/mobile/dist/**` | dist 只来自上游 build + link；**禁止**当补丁目录改 |
| 未授权时在 consumer 会话里跑 `pnpm build:mobile` 改 EDS 产物 | 仅允许用已有 dist / `ensure-eds-mobile.mjs` 拉**已构建**结果 |

**【必须】** EDS 变更只在 **eds-mobile** 仓库完成；本仓库只做集成（import Eg*、`useEdsTheme`、导航/Scene）。上游 build 或 pin 更新后，在本仓库 `npm install` / 重启 Metro 同步。

**唯一例外**：用户在本会话**明确授权**「改 eds-mobile / 切到设计系统仓库改」— 否则 Agent **不得**打开或编辑 `../eds-mobile/**`。

**链接方式（本地，非 npm）**：`package.json` → `"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"`（`package-lock.json` 应对应 `../eds-mobile/packages/mobile`，**不是** `registry.npmjs.org`）；`metro.config.js` → `watchFolders: [edsMobileRoot]`。

### 3.2 dev 实时生效

| 改了什么 | 怎么验 |
|----------|--------|
| `src/**` | Metro 保存即刷新；Native 用 Fast Refresh |
| `../eds-mobile/packages/**` | **仅** eds-mobile 维护者在设计系统仓 `pnpm build:mobile` → `pnpm sync`；业务仓 `npm install`（或 `ensure-eds-mobile.mjs`）拉 dist，**禁止**手改 `node_modules/@eds-evergreen/mobile/dist` |

**EDS 更新到业务仓（维护者已 build 后）**

```bash
# 业务仓
npm install          # file: 直连 ../eds-mobile/packages/mobile；pnpm store 拷贝 stale 时优先 npm
npm run typecheck
./node_modules/.bin/expo start --port 8081 --clear
```

Token 若含 `build:tokens`：`--blur-xs` / `--depth-xs` 等为 `var(--scale-1)`（4px），影响 inset 阴影观感。`EgNavBar` / `EgCregisTabBar` iOS 26+ **禁止** `forceRnImplementation` 绕过。

**【禁止】** 没开 dev、没目测，就声称 UI 已完成。

**问题上报（给 EDS）**：机型 / iOS 版本、`kind` / `iconCount` / `size`、截图、是否外包了 View padding；对齐以 showcase 同配置真机为准。

### 3.3 Git（双仓库）

**Agent 纪律**

- **【禁止】** 主动 `git push`
- 用户说「推」→ 只给 commit message、预检命令、可复制 push；**用户自己推**
- 用户未说 commit / push → **不得**提交

含 EDS 改动时：先在 eds-mobile commit/push，再在本仓库 `npm install` 刷新 link。

---

## 4. UI 文案 i18n

栈：`react-i18next` · `useTranslation()` · `src/i18n/locales/{zh-CN,en-US,zh-TW}.ts`。

### 4.1 五条规则

1. **【必须】** 固定 UI 文案全部 `t('key')`：Tab、按钮、标题、placeholder、toast、无障碍 label。
2. **【必须】** **zh-CN 为语义基准**；en / zh-TW **禁止** Agent 自行翻译——缺则只补 zh-CN key，告知用户补翻译。
3. **【禁止】** 对 **value** 调 `t()`：姓名、地址、hash、编号、金额、时间、Mock 业务字段。
4. **【必须】** 标签与值分离（见下例）。
5. **【禁止】** Scene 里硬编码中英 UI 串（Mock **数据**如 `mock-home-summary` 除外）。

```tsx
// ✅
<Text>{t('profile.theme')}</Text>
<Text>{deviceInfo.deviceType}</Text>

// ❌
<Text>{t(deviceInfo.deviceType)}</Text>
<Text>主题</Text>
```

### 4.2 加 key 流程

1. 在 `zh-CN.ts` 加 key（嵌套与现有结构一致，如 `scenes.homeTitle`）
2. **同一 key** 同步写入 `en-US.ts` · `zh-TW.ts`（无翻译时暂填 zh-CN 同文案，便于肉眼发现缺失）
3. Scene 里只用 `t('...')`，不写 fallback 硬编码

---

## 5. 样式与展示

### 5.1 Token 与圆角平滑

- 业务：`useEdsTheme()` + `edsPx()` + `src/utils/edsTheme.ts` 命名 helper（`edsPageBackground` · `edsSceneContentInset` · `createEdsTypographyStyles` / `SceneText` variant）
- **【必须】** Scene 水平内边距统一 `edsSceneContentInset(spacing)`（`EDS_SCENE_CONTENT_INSET`），禁止单页另写 `spacing-*` 当「全局边距」
- **【必须】** 语义色/字档走 `SceneText` variant 或 Eg* 的 color token prop（如 `text-base-secondary`），禁止 Scene 内 `color: '#…'` 或 `colors[...]` 拼一行覆盖（除非 variant 尚未收录 → 先补 `edsTheme`）
- **Cregis 品牌色**：浅/深均为 **`#1FC35A`** — 经 `getCregisThemeColors()` / `useEdsTheme()` 覆盖 EDS 默认 `brand` 族（`text-brand` · `material-brand` · `event-focus-brand` 等）；勿在 Scene 手写绿 hex

### 5.2 滚动与顶底虚化

无 Desktop `EgSkid`；RN 约定：

**【必须】**

- 一页一个主滚动：`ScrollView` 或 `FlatList`（参考 `SceneScaffold.tsx`）
- 父级 `flex: 1`，滚动子级 `minHeight: 0`，避免双 Scroll 抢手势
- 顶/底 scrim 用 EDS blur / mask token，不用 `#fff` / `#000` 顶掉

**【禁止】** 滚动区域祖先随意 `transform` / `opacity < 1`（会导致 blur 失效）

### 5.3 网络名称

| 位置 | 写法 |
|------|------|
| 链 Tag | `Ethereum` · `BNB Smart Chain` · `Bitcoin`（全名） |
| 金额列 | 可 `USDT` + 链上下文 |
| **禁止** | Tag 写 `BSC` · `USDT-Ethereum` |

---

## 6. Modal / Sheet 生命周期

手段（按优先级）：EDS 场景 Sheet（若有）→ RN `Modal` → Navigation `presentation: 'modal'`。  
参考：`BiometricPromptSheet.tsx` · `useBiometricPrompt.ts`。

### 6.1 逻辑态 vs 视觉态

| | 存什么 | 谁管 |
|--|--------|------|
| **逻辑态** | 流程还应打开（store / `useState`） | 业务 hook |
| **视觉态** | `Modal visible` · Reanimated 位移/透明度 | 组件 |

**【必须】** 关闭顺序：

```text
用户点关闭 → 先播出场（视觉态 false）→ 动画结束 onDismiss/onClosed → 再清数据、逻辑态 false
```

**【禁止】** 逻辑态先 false 导致内容瞬间清空（闪空）；**禁止** Browser / Native 各一套 Sheet 组件。

### 6.2 动效

**【必须】** `mobileMotion.spring.*` · `mobileMotion.timing.*` 或 Eg 内建。**【禁止】** 手写 spring 数字。

---

## 7. Native 开发与 EDS preview 分工

| 验什么 | 入口 |
|--------|------|
| 单个 Eg*、Customize、Props API | eds-mobile `pnpm dev:playground` |
| 五 Tab Scene、业务流、集成 | 本仓库 `npm run ios` / `npm run android` |

**【禁止】** 在本仓库恢复 Web preview、Browser 壳、Inspect 侧栏、GitHub Pages 静态预览。

详案：`docs/eds-preview-architecture.md`。

---

## 8. Motion（consumer 只使用）

**【禁止】** 改 `eds-mobile/.../spec/motion/*` · consumer 私造 preset。

| 动效类型 | 谁实现 | 入口 |
|----------|--------|------|
| 按钮 press、Tab 指示器 | EDS Eg* 内部 | 不手搓 |
| Stack Push/Pop | navigation | `screenOptions/stackOptions.ts` → `mobileMotion.timing.navigationPush` |
| Sheet / 流程 | hooks + Reanimated | `mobileMotion.spring.default` 等 |

**不进 store**：弹窗步骤、动画 progress、scroll 偏移 → hooks + `useSharedValue`。

详案：`docs/cregis-mobile-project-brief.md` §A · §C。

---

## 9. 校验与 PR

```shell
npm run typecheck
```

**PR 自检**

- [ ] 仅 `@eds-evergreen/mobile`；无 desktop 包
- [ ] StyleSheet 无 hex / 魔法 spacing（§2.3 预览例外除外）
- [ ] UI 走 i18n；value 不 `t()`
- [ ] Modal 先动画后清态；动效用 `mobileMotion`
- [ ] 未擅自改 §7.3 壳层定位
- [ ] Metro / 模拟器已目测
- [ ] 有 EDS 改动：远程 SHA 存在且 CI pin 一致

---

## 10. 文件索引

| 主题 | 路径 |
|------|------|
| 项目详案 | `docs/cregis-mobile-project-brief.md` |
| 预览架构 | `docs/eds-preview-architecture.md` |
| EDS 规范 | `../eds-mobile/.cursor/rules/work.mdc` |
| 主题 hook | `src/hooks/useEdsTheme.ts` · `src/utils/edsTheme.ts` |
| i18n | `src/i18n/locales/*.ts` |
| Stack 动效 | `src/navigation/screenOptions/stackOptions.ts` |
| Modal 示例 | `src/scenes/profile/BiometricPromptSheet.tsx` |
| CI pin | `.github/workflows/deploy-pages.yml` → `ref:` |

---

## 11. 版本

| 字段 | 值 |
|------|-----|
| 文档版本 | 1.1 |
| 细化可执行示例与目录边界 | 2026-09-16 |

**本规范为业务项目强制约束。违反项须在 PR 修正或取得维护者书面例外。**
