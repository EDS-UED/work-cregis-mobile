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
设计系统    → ../eds-mobile/**   本仓禁止改；**每次**改 EDS 须用户当次授权（§3.1）
说「同步」   → 才拉最新 @eds-evergreen/mobile dist（§3.1.2 · 非「推」）
EDS preview → playground（模拟器/真机）；禁止 Web preview
一套代码    → 同一份 Scene 跑 iOS / Android，禁止第二套 UI
```

---

## Agent 协作方式

**过程中**：每个动作（读、搜、改、验）动手前或同时一两句——为什么、依据哪条 §、边界（改什么 / 不改什么）。**禁止**闷头改完再汇报；**禁止**五段式模板。

**任务边界（默认）**

| 用户说了什么 | Agent 做什么 |
|--------------|--------------|
| **「提交」** | §3.3.1：**`yang`** · **全量** commit（工作区须净）· **不** push |
| **「拉取」/「pull」** | §3.3.1：同步 GitHub 已 merge 的 **`origin/yang`**（Agent 亲自 `fetch`/`pull`） |
| **「推送」/「推」** | §3.3.1：**全量** commit → **`yang` 干净** → **`yang` → `main`** → GitHub + EAS `preview`；收尾 **交付块**（§3.3.1） |
| Expo Go 与项目 SDK 不一致 | 先确认 `package.json` / `work.md` §1 锁定版本；真机 Go 过旧/过新 → 模拟器或 Dev Client（§1） |
| 只提业务 Scene / 功能 | 只改 `src/**`（及 i18n / navigation / store）；**新页必读 §2.5**；**改 Home 顶栏必先读 §2.3.1**，禁止未读就改 overlay / reserve / `forceRnImplementation` |
| **设计 / 生成新页面** | **参考** [`docs/design.md`](../docs/design.md) §5.0（非强制改造既有页） |
| 只提 token / Eg 组件行为 | **禁止改** `../eds-mobile/**`；**每次动手前**须用户当次明确授权（§3.1）。未授权 → §3.1.1 反馈或业务 workaround，勿手搓 Eg* |
| **明确要求改 EDS / eds-mobile** | 仅以**当条消息写明的范围**为授权；**禁止**擅自扩大（Showcase / build / 连带组件）除非用户同意 |
| **「同步」** | **唯一**授权 §3.1.2：拉最新 `@eds-evergreen/mobile` dist（**非** §3.3「推」）。**禁止** DS 有改动就 build / 改业务 import / 清 Metro — 未说「同步」则业务按**当前 dist** 继续，不受影响 |

**收尾**：两三句——做了什么、还需什么、验证过没过。**禁止**复述全过程。

**心里有数**：eds-mobile 改动 ≠ 本仓自动跟；**同步** = dist（§3.1.2）；**提交/拉取/推** = Git（§3.3.1）。**拉取 ≠ 同步**。

---

## 0. 速查索引

| 主题 | 章节 |
|------|------|
| Agent 协作 | 文首 |
| 目录该改哪 | §0.1 |
| Expo / 命令 | §1 |
| EDS 消费、组件/token | §2 |
| EgButtonGlass iOS 26 内边距 | §2.4 |
| **EDS ↔ 业务 · 集成契约（DS 改不动业务，除非「同步」）** | **§3.1** |
| **EDS 联调清单（Agent 只写 work，不改 eds-mobile）** | **§3.1.1** |
| **拉最新 dist（关键词「同步」）** | **§3.1.2** |
| 分支 · Git 关键词（提交/拉取/推）· EAS | §3.3 · §3.3.1 |
| EDS linked Metro 联调（可选 · 非默认集成） | §3.2 |
| i18n | §4 |
| 原生 vs RN、Eg* 边界 | §2.3 |
| Home 顶栏（Showcase 对齐） | §2.3.1 |
| **业务页视觉默认** | **`docs/design.md`** · §5.0 |
| 稿面数值 → 字阶/色解码 | §5.0.1 |
| 样式、滚动、网络名称 | §5 |
| Modal / Sheet 生命周期 | §6 |
| Native 开发与 EDS preview 分工 | §7 |
| Motion | §8 |
| 校验与 PR | §9 |
| 文件索引 | §10 |
| **踩坑记录（Expo 边界 · 手势 · 坐标 · 验证）** | **§12** |

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

Read the exact versioned docs at https://docs.expo.dev/versions/v58.0.0/ before writing any Expo / RN API code.

**【必须】** 本仓库锁定 **Expo SDK 58**（`expo` ~58、`package.json` 与 EAS `runtimeVersion.policy: sdkVersion` 一致）。升/降 SDK 须与用户对齐并**同步改** `work.md` §1 与 `docs/eas-expo-go-preview.md`。

**本地验 UI（Expo Go）**：iOS 真机 App Store **Expo Go** 须与 **SDK 58** 一致（与项目锁定对齐）；仍不匹配时用模拟器 `npm run ios` 或 Dev Client `npm run ios:device`。若红屏 **`Cannot find native module 'ExpoFetchModule'`**：`app.config.ts` 已设 `EXPO_PUBLIC_USE_RN_FETCH=1`（RN fetch）；改后须 **Metro `--clear` 重启**。

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
| `metro.config.js` | linked 示例 + `expo-router/unstable-native-tabs` → `src/shims/…`；`@/*` → `src/*`（§3.2） |
| **【禁止】** 安装 `expo-router` 作业务依赖 | 与 RN Navigation 冲突；勿用 `EXPO_ROUTER_DISABLE_*` 代替 prune（除非 Expo 仍误判） |

`npm install` / 同步 EDS 后若仍红屏：**删 hoisted 包后必须重启 Metro `--clear`**（旧进程会缓存误判）。

---

## 2. 设计系统消费（强制）

### 2.1 Mobile-only

**【必须】** 经 **`file:../eds-mobile/packages/mobile`** 消费 assemble **`dist`**。**集成契约（§3.1）**：Scene 只针对 **当前 dist** 写码；eds-mobile 怎么改 **默认不牵动本仓**，直到用户 **「同步」**（§3.1.2）。`npm start` / §3.2 watch 为可选联调，**不是**默认集成节奏。

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

**【必须】** **Stack 内页无根 TabBar**（个人中心 · 团队中心及其子页 · 通知 · 扫码等）：`SceneScaffold` **`showNavBack: true`**（`useHideTabBarForInnerPage` · **不**加 `egTabBarScrollContentReserve` 底距）；**每增 Home `Stack.Screen` 内页**须同步 `navigation/homeTabScreenOptions.ts` → **`TAB_BAR_HIDDEN_HOME_STACK_ROUTES`**（与 `getFocusedRouteNameFromRoute` 栈顶一致）。**【禁止】** 内页为 Tab 留滚动底距或再叠自定义 Tab 条。

**【必须】** **`EgSheets` 内容插槽**：DS 已内置左右 **`spacing-5`**（`SHEETS_CONTENT_PADDING`）；子节点 **勿**再包 `edsSceneContentInset` / 全站页边距。列表用 `EgDataList` `sceneContentInset` 只对齐 **DL 屏缘**，不是 Sheet 外再套一层。

### 2.3 原生 vs RN（强制）

**仅**下列 EDS 组件允许走平台原生增强（Liquid Glass、系统 Nav/Tab 等）——分支在 **EDS 内部**，业务 **不得** 另接 UIKit / 系统 API：

| 组件 | 业务侧用法 |
|------|------------|
| **EgNavBar** | iOS 26+：**栏背景继承原生** — Stack 用 `egNavBarNativeStackScreenOptions`（`background: 'auto'` → `scrollEdgeEffects.top`，与 Showcase 一致），`headerTransparent` + `contentStyle`/`ScrollView` 为 `box-page`；**禁止**自绘 Nav 底或 RN `EgNavBar` 叠在系统栏上。自定义左右（Home）见 **§2.3.1**。**设计无标题时**：`egNavBarNativeStackOptions({ title: 真实文案, showTitle: false })`，由 EDS 保证非空并透明隐藏（iOS 26 空标题会使 scroll edge 栏背景失效）；业务侧**勿**再手写 `headerTitleStyle` 透明覆盖。验收 scroll edge 时页面内容须超过一屏。主列表 **勿**包 `EdsGlassScreenShell`；`ScrollView` + `contentInsetAdjustmentBehavior="automatic"` 作 scroll edge 采样面。Android / iOS ≤25：RN `EgNavBar` + `EdsGlassScreenShell` + `useEgNavBarScroll`（见 `HomeTopBar` / `SceneScaffold`） |
| **EgTabBar** / **EgCregisTabBar** | `CregisTabBar` 或 iOS 26+ `egCregisTabBarNativeBottomTabsScreenOptions` |
| **EgGlass** | 仅通过 EDS 组件间接出现，业务不手搓 blur 壳 |
| **EgButtonGlass**（EgGlassButton） | 见 **§2.4** · Nav 槽 **EDS 定稿**：`host="navigationBar"` → **`EgButtonGlassNavigationBar`（仅内容 + 热区，玻璃由系统栏提供）** + **`unstable_header*Items`** + **`egNavBarNativeStackHeaderGlassItem`**（`hidesSharedBackground: true`）；`iconCount={1}` 一颗一胶囊；栏项间距用内容 `margin`/`gap`，勿 `unstable_header*Items` 的 `spacing` 类型补偿。**禁止** legacy `headerLeft`/`headerRight` 塞栏项（易叠双层玻璃）。浮层 / RN 顶栏用默认 **`host="canvas"`**（`GlassView` / `glass-button-box`） |

### 2.3.1 Home 顶栏 — 与 Showcase 对齐（强制）

**与 Showcase 同闸**：`shouldUseEgNavBarNativeStack()` / `shouldUseEgTabBarNativeStack()`（**勿**业务私造 Expo Go 分流 — iOS 26+ 上 `EgNavBar` RN 不绘制，overlay 会丢栏背景、胶囊发白）。

| 平台 | Stack / Scene | 顶栏 |
|------|----------------|------|
| **iOS 26+** | `useCregisNativeStackScreenOptions` · Home 叠加 `useHomeMainScreenOptions` + `useHomeIosNativeHeaderItems` | 系统 Nav + scroll edge；栏钮 `EgButtonGlass` `host="navigationBar"` + `egNavBarNativeStackHeaderGlassItem` · `iconCount={1}` |
| **Android / iOS ≤25** | `headerShown: false` | `HomeTopBar` · `EgNavBar` + canvas `EgButtonGlass` |
| **HomeScene** | `shouldUseEgNavBarNativeStack()` | 系统 Nav：**勿** `EdsGlassScreenShell` · `contentInsetAdjustmentBehavior="automatic"` + `useEgNavBarScroll`。否则 shell + `homeScrollTopReserve` |

**【禁止】** iOS 26+ overlay `HomeTopBar`；**禁止** `iconCount={2}` 合并右胶囊；**禁止** `forceRnImplementation`；**禁止** 业务改 EDS 分流。

### 2.4 EgButtonGlass 内边距（iOS 26+ 必知）

**【必须】** 业务继续用 `EgButtonGlass`，**禁止**为「对齐设计稿」在 iOS 26+ 外包一层 `View` padding / margin；**禁止**传已移除的 `forceRnImplementation`。对照 RN 效果只看 EDS showcase 的 **preview 对照开关**，不是业务 API。

| 栈 | 内边距来源 |
|----|------------|
| **iOS 26+ 原生 Liquid Glass** | **仅系统材质 inset（约 4pt）**；EDS 不再叠 RN 的 `spacing-1` / `spacing-4` / EgButton 文本 padding（避免 4+4「偏胖一圈」） |
| **Android / iOS ≤25** | RN 路径不变：icon → `spacing-1`；双 icon → `spacing-4`；文本 → 与 EgButton 同档 |

头像槽：`avatarSlot` + `EgAvatar size="lg"`。联调验收：圆形 icon、双 icon / 头像槽、文本胶囊与 showcase **同配置真机**一致。

**液态玻璃填充（业务侧 · iOS 26+ 原生材质）**

**【必须】** 业务 Scene 使用液态玻璃（`EgButtonGlass` 走原生栈、`GlassControlShell` / `GlassView` 等 EDS 原生路径）时，`variant` **须为 `regular`**（正常填充，与 `EgButtonGlass` 默认一致）。**禁止**业务侧为「更透」默认写 **`clear`**，除非设计稿 / Showcase **该场景明示** `clear`。

| API | 业务默认 |
|-----|----------|
| `EgButtonGlass` | 不传 `variant` 或 `variant="regular"` |
| `GlassControlShell` 等 | `variant="regular"` |

Effect 栈 **`EgGlass` + `glass-*-box`**（expo-blur · 非系统 Liquid Glass）不适用本表，按 box 类型与 Showcase 对齐。

**【必须】** 上表以外 **全部 RN 技术栈**：`View` · `ScrollView` · `FlatList` · `Pressable` · `StyleSheet` · `SceneText` · Zustand · i18n；尺寸/色用 `useEdsTheme()` + `edsPx()` + `edsPageBackground()` 等 helper。

**【禁止】**

- 业务手写 `GlassInteraction` + `EgGlass` 拼玻璃按钮（须 `EgButtonGlass`）
- Native Stack 的 `headerLeft` / `headerRight` 塞 RN 自定义头（iOS 26 不稳定；自定义头 → 浮动 RN 层 + `EgButtonGlass`）
- NativeWind、第三方 UI kit、业务层直接包 `expo-glass-effect` / `BlurView`（页面 Android 模糊采样仅允许 **`GlassBlurScope` + `GlassBlurBackdrop` + `EdsGlassScreenShell`**，与 EDS Showcase 一致）
- 为「像原生」复制第二套 Platform 分支 UI（同一 Scene 只一套 RN 布局）

**【必须】** 页面背景全局 **`box-page`**（`edsPageBackground(colors)` ↔ CSS `var(--box-page)`）。

### 2.5 新 Scene / 新页面 — 设计系统资产（强制）

**【必须】** 设计或实现任何新页面时，UI **只**用设计系统已有资产：

| 类别 | 允许 | 禁止 |
|------|------|------|
| 组件 | `@eds-evergreen/mobile` 导出的 **Eg\***（及项目已批准的 Scene 壳：`SceneScaffold` · `EdsGlassScreenShell` 等） | 手搓与 Eg* 平行的按钮 / 顶栏 / 分组列表行 / Sheet 头 / 玻璃壳 |
| Token | `useEdsTheme()` · `edsPx()` · `edsPageBackground` · `SceneText` variant · Eg* 的 color/size prop | 新 semantic 色名、新 spacing/radius 档位、Scene 内 hex / 魔法数「对齐设计稿」 |
| 图标 | 已 export 的 `EgIcon*`（以 `../eds-mobile` catalog / `dist/components/index.d.ts` 为准） | 临时 SVG / unicode / 第三方 icon 库 |
| 布局 | 现有 token 间距 + 文档化 helper（如 `edsSceneContentInset`） | 为单页私造 `StyleSheet` 常量冒充 token |

**【必须】** 开工前先对照 Figma Mobile（fileKey `LlB2jT8KdxM6taf5wOSAEM`）与 EDS catalog：**页面里每一类 UI 块**（分组列表、披露行、区段标题、模态顶栏关闭钮等）须能指到 **Eg 组件名** 或 **明确 token 组合**（且该组合已在 Showcase 出现过）。

**缺失资产时 — 【必须】停改并询问用户**，不得自行「先凑合上线」。回复须包含：

1. **缺什么**（组件 / 图标 / token / 模板名）
2. **参考稿要什么**（结构、状态、一行示例）
3. **可选路径**（示例）：在 **eds-mobile** 补组件后再集成 · 换用已有最接近 Eg* · 维护者书面例外

**【禁止】** 用 `SceneCard` + 一堆 `Pressable` 拼 iOS「设置」式分组列表来冒充设计系统（缺 **Eg 分组列表 / 披露行** 时属于上述「缺失资产」）。

**【禁止】** Agent 在未获用户对缺失项决策前：写大量 Scene 代码、navigation 接线、或「临时 token」垫样式。

### 2.5.1 个人中心 / 设置页（参考稿 · **待 EDS · 未实现**）

**入口（产品意向）**：Home 右栏用户头像 → **`HomeStack` push** 个人中心（**左返回** + 居中标题；非 modal · 非第五 Tab）。

**信息架构（对齐参考分组列表风格，文案走 i18n）**

| 区段 | 行（示例） | 右侧 |
|------|------------|------|
| 账户 | 账户与安全 | chevron |
| 账户 | 数据与隐私 | chevron |
| 应用 | 语言 | 当前 locale 文案 + chevron |
| 应用 | 外观 | `themePreference`（系统/浅/深）+ chevron |
| 关于 | 检查更新 | 版本号 |
| 关于 | 服务协议 | chevron |

**EDS 缺口（2026-10-27 对照 `@eds-evergreen/mobile` dist catalog）— 须用户决策后再写 Scene**

| 缺口 | 说明 |
|------|------|
| **分组列表 Organism** | 无 `Eg*Grouped*` / Settings 行 / Disclosure 行；仅有 `EgDivider`（module/page）、输入/Button 等，**无法**不手搓复刻参考稿白卡片 + 区内分割线 + 左 icon + 右 chevron/值 |
| **区段标题** | 无专用 Eg 区段头；`SceneText` footnote 可排字但 **不等价** Figma 设置区段规范（须确认是否由列表 Organism 自带） |
| **Modal 顶栏** | 无 Eg Sheet 头（居中 title + 圆形 `EgIconClose`）；可用 Stack `presentation: 'modal'` + `SceneScaffold` / 原生 header，但 **关闭钮形态** 须 Eg 或 §6 书面模板 |
| **图标** | 参考稿多枚（语言/外观/字体/语音等）：dist 中 **无** 一一对应 globe·sun·字体 AA·语音等；仅有部分可映射（如 `EgIconUserSecurity` · `EgIconDatabaseSafety` · `EgIconInformation` · `EgIconClose` · `EgIconArrowRightIos`） |
| **分组底** | 白卡片组：现有 `material-card-shallow` + `radius-lg` 在 `SceneCard` 用过，但 **卡片内行布局仍缺 Eg 行组件** — 单独 token 不足以合规 |

**实现状态**：Home 用户胶囊 → **`PersonalCenter`** Stack 推入；iOS 26+ 返回由 Stack **`egNavBarNativeStackScreenOptions`**（与 Showcase 同），`SceneScaffold` 只同步 `title`；Android / iOS ≤25 返回为 overlay **`EgNavBar`**。列表 UI 为 Eg* 拼装（`PersonalCenterSettingsGroup/Row`），**待 EDS Organism 收敛**。

---

## 3. 仓库边界与工程

### 3.1 EDS ↔ 业务单向边界

**集成契约**：DS（`../eds-mobile`）可独立演进；业务以 **当前 resolve 的 `@eds-evergreen/mobile` dist** 开发与验 UI — **默认不跟、不受影响**，直至用户 **「同步」**（§3.1.2）拉最新 assemble dist。

| 情况 | Agent |
|------|--------|
| eds-mobile 新 commit / Eg* / Showcase 更新 | **不** build、**不**追 API、**不**假定对齐最新 Showcase |
| 红屏 / dist 缺 export | 用 dist **已有** API 或 §3.1.1 反馈；**等**「同步」，**不**为主动拉 dist |
| **「同步」** | §3.1.2 |
| **「推」** | §3.3.1（**非**拉 dist） |

**可改** `src/**` · `docs/**`；**禁改** `../eds-mobile/**` · `node_modules/@eds-evergreen/mobile/dist/**` · 未授权 `ensure-eds-mobile`/`pnpm build:mobile`；缺 Eg* → **停改**、eds-mobile 侧修；**禁**因上游变更强迫业务 import/验收跟「最新 dist」。

**唯一例外 · 改 EDS 须当次授权（2026-11-13 起 · **2026-11-19 强化：每次改都须授权**）**

| 步骤 | 要求 |
|------|------|
| 0 | **上一句已授权 ≠ 本会话永久授权**；每条新任务 / 新文件 / 扩大范围（含 Showcase、脚本、`build:*`）→ **须再问** |
| 1 | 需要 Eg* / token / dist 不具备的能力 → **先说明原因与拟改文件清单**，**询问用户是否授权改 `../eds-mobile/**`** |
| 2 | 用户**未当次明确同意**（如「可以改 EDS」「授权」「在设计系统里改 XXX」）→ **只**走业务 workaround 或 §3.1.1 反馈，**禁止**动 EDS |
| 3 | 用户**已当次授权** → 仅可编辑**已说明范围**内的 `../eds-mobile/**`；`pnpm build:*` 仅在为交付该范围所必需时执行，且须在过程里说明；拉业务 dist 仍须用户说 **「同步」**（§3.1.2） |

**【禁止】** 未经步骤 1–2 直接改 EDS（含组件、token、Showcase、catalog 脚本、`EgSheets` 等），即使判断「业务侧无法做」也不行。**【禁止】** 用户只授权业务 Scene 时「顺手」改 eds-mobile。

**【必须】** Agent 发现 Eg* / 液态玻璃 / 系统 Nav 与 Showcase 不一致时：**只更新本节 §3.1.1 清单（或告知用户增补）并口头反馈**，**禁止**为修 UI 去改 `../eds-mobile/**` 或在业务仓复制第二套玻璃实现。

### 3.1.1 EDS 联调 · 业务反馈清单（Cregis → eds-mobile）

**业务集成对齐（与当前 `@eds-evergreen/mobile` dist 一致 · 同步 2026-11-20 · eds-mobile `91a5a18` + **工作区未提交改动** 全量 `pnpm build:mobile`；`EgGlassCapsule` 等重命名经 shim 别名兼容）**

| EDS 约定 | 业务用法 |
|----------|----------|
| `createEgEdsAnimaPageNavigator` + `EgEdsAnimaPage` | `createCregisPageStackNavigator` · `useCregisStackScreenOptions`；`horizontal` / `horizontal-reverse` / `vertical` |
| `EgEdsAnimaPageShot` + `EgEdsAnimaPageShotTrigger` | `@/eds/page-shot`（业务按需；团队中心当前仍为 Stack `TeamCenter`） |
| `egNavBarNativeStackScreenOptions` | `useCregisStackScreenOptions`（`EgEdsAnimaPage` 内建 iOS 26+） |
| `egNavBarNativeStackOptions` + `unstable_header*Items` | Home · `useHomeMainScreenOptions` + `useHomeIosNativeHeaderItems` |
| `egNavBarNativeStackHeaderGlassItem` | Home 栏每一项（含公司名容器） |
| `EgButtonGlass` `host="navigationBar"` | Home 栏按钮 → **系统栏内容组件**（非 Nav 槽内 `GlassView`） |
| `EgButtonGlass` 默认 canvas | `HomeTopBar` overlay（仅非 iOS 26+） |
| `readEgButtonGlassStackDiagnostics` | Nav 槽按钮走 NavigationBar 路径；**canvas** 仍看 `stack: native \| rn` |
| **`EgDataList` / `EgDataListRow`** | 可点数据列表 · `@/eds/data-list`；Scene 行布局 `getDataListRowLayout(spacing)`（`dataListLayout.ts` 委托 DS metrics） |
| **`EgDataListRowPressable`** | Scroll 内可点行点按缩放 · **轻扫 / 快速滑动不触发**（`unstable_pressDelay` 130ms，与 `EgDataList` 一致）· `@/eds/data-list` |
| **`EgOdometer`** | 场景数字滚动 · `@/eds/animations`；业务传 **`textStyle`**（如 `useEdsTypography().display` + 色 token），动画层不自建 typography / color |
| **`EgItem` / `EgItemGroup`** | 设置列表行 · `@/eds/item`（如个人中心） |
| **`EgTab` / `EgTabBlock`** | 下划线分段 · `@/eds/tab`；胶囊 + 正文 layout-content · `@/eds/tab-block`（首页/通知 `HomeTodoFilterBar` 薄封装）· `useEgHorizontalSegmentSwipe` |
| Semantic **`radius-md` / `radius-lg`** | **`EgDataListRow` 点按底** / **`EgItem` 点按底** → **`radius-md`**；**`EgItemGroup` 分组卡** → **`radius-lg`**（与 Showcase 一致） |

**业务仓必保依赖**：`expo-glass-effect ~58` · Metro iOS **`expo-glass-effect` shim** · `@expo/ui ~58`（iOS 26+ `EgMenu` 走系统菜单，与 Showcase 一致；缺失则回退 RN 浮层）。要对齐 eds-mobile **最新** dist → 仅用户 **「同步」** §3.1.2。

**若真机仍发白 / 仍像 RN 白盒 — 先区分再反馈 DS**

| 场景 | 先验 | 可能归属 |
|------|------|----------|
| Home / 设置 **栏上胶囊**（`host="navigationBar"`） | 是否 **`hidesSharedBackground`** 每项都有；是否 **legacy `headerLeft`**（业务已禁止）；scroll edge：内容 **> 一屏** · `automatic` inset | DS / RNScreens 栏项材质 · 或 dist 未更新 |
| **浮层顶栏**（canvas `EgButtonGlass`） | `readEgButtonGlassStackDiagnostics()` → **`stack: 'rn'`** | 缺 `expo-glass-effect` 或未 `--clear` Metro → **工程**；闸门文档 → **DS** |
| **历史：双返回圈** | dist 是否含 **`unstable_headerLeftItems` 返回**（无 `headerLeft` 内嵌玻璃） | 旧 dist → 用户 **「同步」** §3.1.2 + 清 Metro |
| **`EgMenu` RN 浮层空白**（2026-11-12 · 已在 DS 修复并同步） | 原因：`EgMenuPanel` 内容放在 `absoluteFill` 里（面板高度 0），且 iOS `BlurView` 叠在内容之上把文字糊掉。修复：内容回到布局流、玻璃层置于内容之下 | 已修（eds-mobile `EgMenuAnchored.tsx`） |

**转 DS / 真机对标须附带**：机型 · **iOS 精确版本** · Expo Go / Dev Client · `readEgButtonGlassStackDiagnostics()` JSON · `kind` · `iconCount` · `host` · 截图（Home 左/右、设置返回）· 本仓 dist 对应 **eds-mobile commit / 构建时间**（**同步前**以当前 dist 为准，非 eds-mobile `main` 最新）。要最新 dist：**仅**用户 **「同步」** → §3.1.2（**禁**修 Scene/bug 时顺带 build）。

### 3.1.2 同步（EDS dist · 仅「同步」）

**≠** §3.3.1「推」。用户说 **「同步」** → Agent：**①** `node scripts/ensure-eds-mobile.mjs`（必要时 `../eds-mobile` `pnpm build:mobile`）**②** `npm install`（`file:../eds-mobile/packages/mobile`）**③** 需验 UI 时 `npm run start:metro-only -- --clear`（8081）。**禁**未说「同步」执行（含 dist 旧 / DS 刚改 / 要对齐 Showcase / 用户只说「推」）。dist 旧 → 告知、等「同步」；缺 export → 用已有 API 或 §3.1.1；eds-mobile 刚改 → 提示说「同步」。`npm start`/§3.2 watch **不改变** §3.1 契约；日常验 UI 优先 **`start:metro-only`**。

```bash
cd work-cregis-mobile && node scripts/ensure-eds-mobile.mjs && npm install
kill -9 $(lsof -ti :8081) 2>/dev/null; npm run start:metro-only -- --clear
```

`@eds-evergreen/mobile`：**禁** registry 版；`file:` + lock 指向 sibling；Metro linked（`consumer-metro.config.example.cjs` + 本仓 shim/`@/*`；详案 `docs/consumer-linked-dev.md`）。

### 3.2 dev 联调（可选 · 非默认集成）

默认 §3.1；验 Scene 用 **`npm run start:metro-only`**。**可选** DS+业务：`npm start` / **`npm run dev`**（8081 · `prestart` ensure · EDS `watch:linked-consumers`；关 token watch `CREGIS_EDS_TOKEN_WATCH=0`）；拉 dist 用 **`npm run start:with-ensure`** 或 **「同步」**；组件源码 `CREGIS_EDS_LINKED_METRO=1`。**≠** 正式拉齐 dist（仍须「同步」）。关 Expo 后勿长期留 watch/showcase。

| 改了什么 | 怎么验 |
|----------|--------|
| `src/**` | Fast Refresh |
| eds-mobile 组件（**禁**本仓改 DS） | linked Metro + FR |
| token/spec | watch → build:tokens → reload |
| 慢首屏 | **禁**主 barrel；子路径 + FileStore；非 Home Tab 延迟 `require` |
| 仅 dist | **「同步」** §3.1.2；**禁** Agent 主动 ensure / 手改 dist |

**依赖**：`@/eds/*` + shims → dist 细路径；**禁**主入口 · **禁**未 export 子路径。EAS preview → §3.3。`build:tokens` 的 `--blur-xs`/`--depth-xs` = 4px inset 观感。iOS 26+ **禁** `forceRnImplementation`。**禁**没开 dev 没目测声称 UI 完成。EDS 问题 → §3.1.1 + 机型/iOS/diagnostics/截图。

### 3.3 Git（双仓库）与 EAS

| 仓库 | 远程 | 角色 |
|------|------|------|
| `work-cregis-mobile` | `EDS-UED/work-cregis-mobile` | 业务 App |
| `../eds-mobile` | `EDS-UED/eds-mobile` | DS；EAS 云端 **clone `main` + `pnpm build:mobile`** |

**三分支**（`dev` 已更名 **`yang`**）

| 分支 | 角色 | push | 合并 |
|------|------|------|------|
| **`main`** | 集成 / EAS 对外 | **禁**日常直改、直 push | **仅** **`yang` → `main`**（PR）；**仅维护者**操作 |
| **`yang`** | 维护者开发 + 收 jojo | 维护者直推 | **`jojo` → `yang`**（PR）→ 验稳 **`yang` → `main`** |
| **`jojo`** | jojo 开发 | 仅 **`jojo`** | **禁**直推 `main`/`yang`；PR → **`yang`** |

```text
jojo ──PR──► yang ──PR──► main    EAS / 同事 preview 对齐 main
```

换分支：`git fetch origin` → `git checkout yang|jojo && git pull origin <分支>`（维护者 / jojo）。

**Rulesets**（[Settings → Rules](https://github.com/EDS-UED/work-cregis-mobile/settings/rules)）

| 名 | 分支 | 要点 | Bypass |
|----|------|------|--------|
| **`main`** | `main` | 禁删/强推/直 push · PR **+1 review** | **无** |
| **`work-yang`** | `yang` | 同上；非 bypass 须 PR | **`theyangsong`** |
| **`work-jojo`** | `jojo` | 禁删/强推/直 push | **`lulujj123`** · **`theyangsong`** |

[23519770](https://github.com/EDS-UED/work-cregis-mobile/rules/23519770) · [27705187](https://github.com/EDS-UED/work-cregis-mobile/rules/27705187) · [27705869](https://github.com/EDS-UED/work-cregis-mobile/rules/27705869)

**EAS**：Team **`theyangsongs-team`** · 项目 **`cregis`**（`@theyangsongs-team/cregis` · 勿混 `@theyangsong/cregis-ued`）· **Cregis UED** · channel **`preview`** · Dashboard OTA 二维码；同事 **Expo Go SDK 58**（§1）。

**Agent 默认**：无明确 **提交/拉取/推** → **不得** `commit`/`push`；改码默认 **`yang`**，**禁**在 `main` commit。本地 `file:` dist 不替代 push；同事只看 EAS。

#### 3.3.1 关键词（Git）

| 词 | 【必须】Agent 执行 |
|----|-------------------|
| **提交** | `checkout yang`（**禁**在 `main`/`jojo` 代提交）→ `typecheck` → **全量暂存**：默认 `git add -A`（**禁** `.env*` / 密钥 / 明显误建文件；用户点名路径除外也须一次性纳入）→ `commit` → **`git status` 须干净**（仅允许已写入 `.gitignore` 的忽略项；**禁止**「只交订阅/只交会话」而留脏工作区，除非用户**当条**写明排除清单）→ **不** `push` |
| **拉取** | 目标：本机 **`yang` = 远端已 merge 的 `yang`**（典型 PR **jojo→yang** 后）。`fetch` → `checkout yang` → `pull`；本地脏 → `stash`→`pull`→`pop`，冲突即停。**禁**跑 `ensure-eds-mobile`（≠「同步」）。收尾 `log -3 --oneline`。若上下文刚 **yang→main**：再 `pull main`，`yang` 上 `merge main` |
| **推** | **先**完成与 **提交** 相同的全量 commit → **`git status` 干净** → `pull` + `typecheck` → 目标：**GitHub `main` = 当前 `yang`**，且 **EAS preview = 本地 Metro**（含 EDS dist）。**yang→main**（**首选** `push yang` → `gh pr create/merge` → `pull main`；规则允许时才本地 `merge`+`push main`+`yang merge main`）→ **先** `eds-mobile push main` **后** 业务 `main`（Workflow `EDS_MOBILE_GIT_REF` 默认 `main`）→ 等 workflow **SUCCESS**（`eas-cli workflow:runs` / `workflow:logs`；兜底 `preview:update`）→ **【必须】交付块**（下） |

**推送 / 提交收尾 · 交付块**（用户要 **推** 或 **推送** 后 **【必须】** 回复）：

```text
分支 · 提交：<branch> @ <short-sha> <subject>
App：package.json version · Expo SDK · RN 版本（自 package.json）
GitHub：<compare 或 PR URL>
EAS：channel preview · Update ID / group · Dashboard Updates 链（或 workflow run 状态）
Expo Go：SDK 须与 §1 一致（当前 58）
本地：git status 须 working tree clean
```

仅备份 **`origin/yang`**：仍须 **全量 commit + 工作区干净**，再 `push origin yang`；交付块同上（**可省略** main/PR/EAS 若未跑 workflow，但须写明「仅 yang 备份 · 未发 preview」）。

用户要备份远程 `yang`：`push origin yang` 须 **先** 全量提交且工作区干净，**禁**部分提交后 push。

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

### 4.3 Mock 数据 · 首页待办币种（`useHomeStore`）

**【必须】** 待办列表数据生产时，**全局序号 1–10**（按 `buildInitialTodoItems` 生成顺序、跨 `approval` / `sign` / `errorCallback` 合计）的 `currency` **依次为**（Ticker 大写）：

`HYPE` → `TON` → `ZEC` → `USDT` → `AAVE` → `MNT` → `GBG` → `1INCH` → `DEEP` → `AVAX`

- 常量：`src/store/useHomeStore.ts` · `HOME_TODO_MOCK_CURRENCIES_FIRST_10`
- 序号 &gt; 10：按上表 **循环**（`(seq - 1) % 10`）
- `GBG`：业务 Mock ticker；EDS `EgSymbol` 映射 **Bitget Token**（`eds-bgb-bitget token`）见 `src/utils/edsCryptoSymbol.ts`

### 4.3.1 Mock 数据 · 团队地址簿（28 条）

**【必须】** `TEAM_ADDRESS_BOOK_ROWS` **固定 28 条**（`teamAddressBookDetailMock.ts`）。

| 字段 | 规则 |
|------|------|
| **币种 Ticker** | 与 §4.3 同序循环：`HOME_TODO_MOCK_CURRENCIES_FIRST_10`，序号 `index` → `(index % 10)` |
| **昵称** | `TEAM_MEMBER_NAME_POOL[index]`（与成员管理 28 人同源） |
| **地址** | 按 Ticker 链形态确定性派生（EVM `0x` 40 hex · `TON` `EQ…` · `ZEC` `t1…`） |
| **网络** | 主文 Tag · `networkLabelKey`：`TON`→TON · `ZEC`→Zcash · `USDT` 约每 3 条之一 BNB · 其余 Ethereum |

**列表展示**：主文 **仅名称**；副文 **仅地址**（`EG_DATA_LIST_SUB_TEXT_MAX_LINES` 内换行）；**文本底 Tag**（关主文 Tag）顺序：`默认收款`（colorful `apricot`）→ `默认付款`（`grass`）→ 网络（`system` `subtle`）· **仅第 1 条** 含默认收/付 Tag。

团队底栏 **`EgSearch` placeholder** 统一 i18n `team.searchPlaceholder`（zh-CN：**搜索**）。

### 4.4 日期时间展示（Mobile）

**【必须】** 用户可见的**完整日历日**（含 Mock、详情字段、列表副文本等）统一 **`yyyy/MM/dd`**（斜杠 · 月日**两位**零填充）。**禁止**界面展示 `yyyy-MM-dd`、未补零的 `yyyy.M.d` 等形态。

| 形态 | 约定 |
|------|------|
| 仅日期 | `2024/03/18` |
| 日期 + 时刻 | `2024/03/18 13:23:45`（日期段斜杠 · 时分秒段沿用 `HH:mm:ss`） |
| 通知分组标题「今天 / 3月18日」等 | 继续走 `messagesSectionLabel` · **不适用**本条 |

**【必须】** 展示层调用 `src/utils/formatMobileDateTime.ts`：

- `formatMobileDate` · 仅日
- `formatMobileDateTime` · 日 + 时刻

接口 / Store 若仍为 ISO（`-`）或历史点号，**展示前**须格式化；新 Mock **直接**写 `yyyy/MM/dd`。

**【禁止】** Scene 内手写 `replaceAll('-', '/')` 代替上述 helper（解析须零填充月日）。

---

## 5. 样式与展示

### 5.0 业务页视觉默认（`docs/design.md` · 参考）

[`docs/design.md`](../docs/design.md) 与 `.cursor/rules/design.md` 供 **新页设计 / 从零生成** 时作 typography、间距、尺寸**参考**，可持续扩展。

**【禁止】** 未经用户准许，以该文档为由**替换**已有 Scene 的布局、样式、字阶等（既有实现以稿面 / 已验收为准）。

**【必须】** 用户明确「按 design.md 对齐」或新建页面时：采用下表默认（全文见 `docs/design.md` §0）：

摘要：

| 类型 | 默认 |
|------|------|
| 分段标题 | `typography-title` · `text-base-primary` → `SceneText variant="title"` |
| 正文 | `typography-body-medium` · primary → `bodyMedium` |
| 副文本 | `typography-body-small` · secondary → `bodySmallSecondary` |
| Item 主文案（设置行等） | `typography-body-medium-strong` · primary → `bodyMediumStrong` |
| 更重主文案（如待办金额行） | `typography-body-medium-heavy`（600）→ `bodySemibold` |
| 页边距 | 上 `spacing-4`（`EDS_NAV_CONTENT_GAP`）· 左右 `spacing-5`（`EDS_SCENE_CONTENT_INSET`）· 下 `spacing-8` |
| 块/卡片间距 | `spacing-7` |
| Item 内间距 | 标题–副文本 `spacing-1`；左图/头像/icon–文案 `spacing-3` |
| 尺寸 | 头像/币种默认 `avatar-lg`（首页待办币种图 `avatar-xl`）；icon `symbol-md` |
| **产品介绍页（Intro）** | 全文 **`docs/design.md` §2.4** · 参照团队 AML · `fixedBottomChrome` 底栏常驻 |

### 5.0.1 稿面数值 → EDS 字阶 / 色（Agent 解码）

用户口述 **px / 字重数字** 时，**【必须】** 先查 `../eds-mobile/packages/tokens/spec`（`typography/semantic.json` · `text/styles.json` · `CSS-TOKENS.md`）映射 **Figma class / CSS 变量**，再用 `SceneText` variant + 色 token实现，禁止手搓 `fontSize: 17` · `fontWeight: '500'`。

| 用户常说 | EDS 字阶（class） | RN `SceneText` |
|----------|-------------------|----------------|
| 17 · **400** | `typography-body-medium` | `body` / `bodyMedium` |
| 17 · **500** | `typography-body-medium-strong` | `bodyMediumStrong` |
| 17 · **600** | `typography-body-medium-heavy` | `bodySemibold` |
| 主色 **100%** | `var(--text-base-primary)` | variant 默认 primary |
| 主色 **60%** | `var(--text-base-secondary)` | `bodySmallSecondary` 或 `secondary` |
| 主色 **40%** | `var(--text-base-tertiary)` | `bodyMediumStrong` 等 + `colors['text-base-tertiary']`（spec α 40% · 非 `opacity` 手写） |

权威对照见 EDS `packages/tokens/spec/css-dist-reference.md` 透明度档（如 `66` → 40% → tertiary）。

**Icon / SVG 着色（`EgSymbol` 等）**

| 图形类型 | 用哪族 token | 典型入参 |
|----------|----------------|----------|
| **线框 / stroke 图标** | **Stroke**（如 `stroke-divider-deep` · `stroke-decor`） | `strokeColorToken` + `strokeScaleToken` |
| **填充 / Fill 图标** | **Material**（如 `material-decor` · `material-base-quaternary` · `status-success`） | `strokeColorToken` / fill 着色（勿用 `text-base-*` 冒充填色） |
| **与文案同色** | **Text**（`text-base-primary` · `text-base-secondary` · …） | 仅当图标语义随字色走时使用 |

### 5.1 Token 与圆角平滑

- 业务：`useEdsTheme()` + `edsPx()` + `src/utils/edsTheme.ts` 命名 helper（`edsPageBackground` · `edsSceneContentInset` · `createEdsTypographyStyles` / `SceneText` variant）
- **【必须】** Scene 水平内边距统一 `edsSceneContentInset(spacing)`（`EDS_SCENE_CONTENT_INSET` = **`spacing-5` / 20px**），禁止单页另写 `spacing-*` 当「全局边距」
- **【必须】** 导航底到首屏内容间距统一 `edsNavContentGap(spacing)`（`EDS_NAV_CONTENT_GAP` = **`spacing-4` / 16px**）；`SceneScaffold` · 首页 `HomeScene` 已接，新页勿另算
- 新页若采用 `docs/design.md`：下边距 `spacing-8`、块间距 `spacing-7`；水平边距仍以 `EDS_SCENE_CONTENT_INSET` 为全局左右标准（**不**因此对已有页做追溯替换）
- **【必须】** 语义色/字档走 `SceneText` variant 或 Eg* 的 color token prop（如 `text-base-secondary`），禁止 Scene 内 `color: '#…'` 或 `colors[...]` 拼一行覆盖（除非 variant 尚未收录 → 先补 `edsTheme`）
- **Cregis 品牌色**：浅/深均为 **`#1FC35A`** — 经 `getCregisThemeColors()` / `applyCregisBrandColors()` 覆盖 EDS `brand` 族；**iOS** 上 `material-brand` 等走 RN `{ space: 'display-p3' }`（`CREGIS_BRAND_DISPLAY_P3` · 与 spec `eds-success` 同源），**Android** 仍为 sRGB hex；勿在 Scene 手写绿 hex

### 5.2 滚动与顶底虚化

无 Desktop `EgSkid`；RN 约定：

**【必须】**

- 一页一个主滚动：`ScrollView` 或 `FlatList`（参考 `SceneScaffold.tsx`）
- 短页滚动：`useEdsMainScrollLayout` — **仅** Tab 根（首页 iOS 26+ 等）· `layoutActive` 随聚焦；**栈内页 `showNavBack` 固定 `flexGrow:1` + inset，不走 layout 闸**（减轻 push 卡顿）。其余同前：视口 `onLayout` 挂外层壳、24px 滞回、橡皮筋常开。`App.tsx` **`enableFreeze(true)`**；Home Tab 接 **`homeTabScreenOptions`**，与 `useHideTabBarForInnerPage` 勿重复藏条
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
| Scroll 内行/卡片点按缩放 | **`EgDataListRowPressable`** | `@/eds/data-list`；与 `EgDataList` 同闸（见下） |
| Stack Push/Pop | navigation | `screenOptions/stackOptions.ts` → `mobileMotion.timing.navigationPush` |
| Sheet / 流程 | hooks + Reanimated | `mobileMotion.spring.default` 等 |

**【必须】** 在 **可滚动正文**（`SceneScaffold` / `ScrollView`）里为行、卡片加点按缩放时，用 **`EgDataListRowPressable`**（或 **`EgDataListRow`**），**禁止**在该场景单独用 `MotionPressable`（`EgEdsAnimaPress`）：前者 `unstable_pressDelay`（130ms）内若父级 Scroll 接管手势，则**取消**按下与缩放 — **轻扫、快速滑动不触发点按动效**，仅明确 Tap 才反馈。`MotionPressable` 限非滚动区或已确认无 Scroll 抢手势的块。

**不进 store**：弹窗步骤、动画 progress、scroll 偏移 → hooks + `useSharedValue`。

详案：`docs/cregis-mobile-project-brief.md` §A · §C。

---

## 9. 校验与 PR

`npm run typecheck`。PR：**jojo→`yang`** · **`yang`→`main`**（仅维护者）。

**PR 自检**

- [ ] 仅 `@eds-evergreen/mobile`；无 desktop 包
- [ ] StyleSheet 无 hex / 魔法 spacing（§2.3 预览例外除外）
- [ ] UI 走 i18n；value 不 `t()`
- [ ] Modal 先动画后清态；动效用 `mobileMotion`
- [ ] 新 UI 块均有 Eg* / 已批准 token 依据；缺失已问用户（§2.5）
- [ ] 未擅自改 §7.3 壳层定位
- [ ] Metro / 模拟器已目测
- [ ] 有 EDS 改动：远程 SHA 存在且 CI pin 一致

---

## 10. 文件索引

| 主题 | 路径 |
|------|------|
| **业务页视觉默认** | `docs/design.md` · `.cursor/rules/design.md` · §5.0 |
| 项目详案 | `docs/cregis-mobile-project-brief.md` |
| 预览架构 | `docs/eds-preview-architecture.md` |
| EDS 规范 | `../eds-mobile/.cursor/rules/work.mdc` |
| 主题 hook | `src/hooks/useEdsTheme.ts` · `src/utils/edsTheme.ts` |
| i18n | `src/i18n/locales/*.ts` |
| Stack 动效 | `src/navigation/screenOptions/stackOptions.ts` |
| **Home 顶栏** | `src/scenes/home/useHomeMainScreenOptions.tsx` · `useHomeIosNativeHeaderItems.tsx` · `HomeTopBar.tsx` · `HomeScene.tsx` · `HomeStackNavigator.tsx` |
| **Stack Nav（iOS 26+）** | `src/navigation/screenOptions/useCregisNativeStackScreenOptions.tsx` |
| **EDS 反馈清单** | **§3.1.1**（本文件） |
| **个人中心（§2.5.1）** | `HomeNavBarParts` 用户胶囊 · `PersonalCenterScene.tsx` · `HomeStackNavigator` |
| Modal 示例 | `src/scenes/profile/BiometricPromptSheet.tsx` |
| CI pin | `.github/workflows/deploy-pages.yml` → `ref:` |

---

## 11. 版本

| 字段 | 值 |
|------|-----|
| 文档版本 | 1.6 |
| §3.3 三分支 · §3.3.1 Git 关键词 · Rulesets 收紧 | 2026-11-20 |
| §12 踩坑记录 | 2026-11-12 |
| §2.3.1 Home 顶栏 · §3.1.1 EDS 联调清单（Agent 不改 eds-mobile） | 2026-10-29 |
| §2.5 设计系统资产门禁 · §2.5.1 个人中心缺口 | 2026-10-27 |
| HomeMain 顶栏三层架构 · 禁止回归表 | 2026-10-27 |
| 细化可执行示例与目录边界 | 2026-09-16 |

**本规范为业务项目强制约束。违反项须在 PR 修正或取得维护者书面例外。**

---

## 12. 踩坑记录（2026-11-12 · 修过的坑勿回归）

### 12.1 Expo 边界（先查后做）

**【必须】** 「原生能力」先确认 **Expo SDK 58 / Expo Go 是否支持**（Expo 自带库如 react-native-screens · RNGH · Reanimated 可用）。不支持就**不做**——混合开发，后续全走 Expo 发包。

**【禁止】** 改 `node_modules/**` 原生代码（`.mm` / `.kt` / `.java`）或用 `postinstall` 打原生补丁：Expo Go 与 OTA（`eas update`）都带不上，只在自建包生效。修复只能在 **JS 层 / DS JS 实现**。

**先确认测试环境**：模拟器 / 真机跑的是 **Expo Go**（`host.exp.Exponent`），不是 Dev Client — 原生改动在 Expo Go 里一律无效。

### 12.2 iOS 26+ · RN `Modal` 内禁止嵌 react-native-screens 原生栈

| 现象 | 根因 | 正解 |
|------|------|------|
| `EgSheets` 内容**点击全部无反应**，但**拖拽正常**（团队切换、快捷入口「编辑」） | `ScreenStack`（scroll edge 宿主 `GlassMaskScrollEdgeHost`）放在 RN `Modal` 里 → `RNSScreen` 挂入窗口时找不到 RN 根，**再挂一个** `RCTSurfaceTouchHandler`，与 Modal 自带的重复派发 → `Pressable` 失效；RNGH 不走 RN 触摸系统所以拖拽仍好 | 浮层用 DS `EgEdsAnimaOverlayModal`（iOS 26+ → `transparentModal`，Android · iOS ≤25 → RN `Modal`）；`EgSheets` 已经 `SheetsModalHost` 处理 |

**排查法**：点不了但能拖 → 先查是否「原生栈套在 RN Modal 里」。对照实验：临时让 `GlassMaskScrollEdgeHost` 直接 `return children`，点击恢复即确认。

**【禁止】** 为修点击而删掉原生 scroll edge（iOS 26+ 原生顶栏会失效）。

### 12.3 Sheet 手势：不要用「换组件 / 改长按」绕点击问题

| 错误做法 | 后果 |
|----------|------|
| Sheet 内列表行改用 RNGH `Pressable` | RNGH 原生按钮 `disallowInterruption = YES` → 手指按在行上时 Sheet 的 Pan 被取消，**中档拖不到大档** |
| `EgSheets` `contentPan` 恒用长按（`buildPan(true)`） | 中档无法直接拖拽换档 |

**【必须】** Sheet 内行保持 DS **`EgDataListRow`**（RN `Pressable`）；`contentPan = buildPan(contentScrollable)`（仅最高档且内容溢出时长按拖）。

### 12.4 RNGH 3 × `@react-navigation/stack` 7.12

- RNGH 3 `PanGestureHandler` **丢弃**旧参数 `minOffsetX` / `maxDeltaX` / `maxDeltaY` / `minOffsetY`，stack 7.12 仍在传 → 卡片 Pan 失去方向约束，Android RN 栈页**无法滚动**。
- **【必须】** 保留 Metro 重定向 `src/shims/react-navigation-stack-gesture-activation-criteria.js`（`metro.config.js` 内 `gestureActivationCriteria.js` 规则），改为 `activeOffset*` / `failOffset*`。改 `metro.config.js` 后须 Metro `--clear` 重启。
- 升级 stack / RNGH 后先复核该 shim 是否仍需要。

### 12.5 Android · 动效页（`EgEdsAnimaPage`）

| 现象 | 根因 | 正解 |
|------|------|------|
| 团队中心 / 设置等页**滚动时整页左右剧烈晃** | 整页拖拽返回的 Pan 与原生 ScrollView 抢同一批触摸；拇指弧线滚动横向分量大，Pan 被激活 → 卡片横移再回弹。调阈值只能降概率 | DS：Android 上 `gestureEnabled` 恒 false，返回交给系统返回手势 / 返回键（iOS ≤25 整页侧滑保留）。**【禁止】** 业务或 DS 在 Android 重新打开 |
| 页面不能滚 | 主 `ScrollView` 缺 `flex: 1` + `minHeight: 0` | `overlayNavScrollSurfaceStyle()` + `nestedScrollEnabled`（`SceneScaffold` / `HomeScene` 已接） |

### 12.6 坐标系（page-shot 飞入 / 飞回）

- **Android** `measureInWindow` 会**扣掉状态栏**（窗口可见区顶）；page-shot 弹层 Modal 开了 `statusBarTranslucent`，原点在**屏幕顶** → 不补偿则飞回落高一个状态栏（实测 47dp），浮层撤掉后真卡片「跳」回原位。DS `measureShotRect` 已补 `StatusBar.currentHeight`。
- **Fabric**：`Modal` 是独立根（`RootNodeKind`），Modal 内 `measureInWindow` 恒相对 Modal，宿主偏移永远是 0 — **别**用「量 Modal 内宿主偏移再相减」去修坐标。
- **iOS 26+**：系统栏 `unstable_header*Items` 渲染在 Screen 树外，**拿不到** page-shot context → 栏上触发器须降级（如扫码改 `navigation.navigate('Scan')`，见 `HomeScanPageShotTrigger`），否则红屏 `must be rendered inside EgEdsAnimaPageShot`。

### 12.7 验证方法（「在模拟器里验证」）

| 场景 | 做法 |
|------|------|
| iOS 模拟器点击 / 滑动 | Xcode 27 无 Simulator.app 窗口、Cursor 无辅助功能权限 → 用 [AXe](https://github.com/cameroncooke/AXe) 注入触摸：`axe tap -x <pt> -y <pt> --udid <UDID>` · `axe swipe …`；截图 `xcrun simctl io booted screenshot` 后缩到逻辑点宽度（iPhone 17 = 402×874pt）坐标即可直接对照 |
| 打开 App | `xcrun simctl openurl booted exp://127.0.0.1:8081` |
| 真机问题（Android 无本地环境） | 让用户录屏 → 用 AVFoundation 抽帧拼图逐帧量位移；DS 内临时 `__DEV__` 日志经 Metro 终端回传真机坐标，**定位后必须删除** |
| DS `build:mobile` 期间红屏「None of these files exist …」 | assemble 清空重建 dist 的瞬时状态（EDS 已改逐文件原子替换，**禁止**整目录 rename — Metro 会卡在旧代码）；构建完 `simctl terminate` + 重开 App。shim **禁止** `../../node_modules/@eds-evergreen/mobile/dist/...` — 用 **`@eds/internal/dist/...`**（Metro 直解析 `eds-mobile/packages/mobile/dist`） |
| 打开 / 切换时「跳一下」类问题 | `simctl io <UDID> recordVideo` 录屏 → AVFoundation（`AVAssetImageGenerator`）按 17ms 抽帧 → 逐帧量**相对位移**（如内容块顶 − 卡片顶）。只看「卡片在动」分不出是动画还是内容自己在动 |

**【必须】** 修一处回归一处：点击、拖拽换档、滚动、原生顶栏效果在同一次验证里一起过，避免「修好 A 坏了 B」。

### 12.8 iOS 26+ · `EgSheets` 打开时内容上下跳动（2026-11-13）

| 现象 | 根因 | 正解（DS 已修） |
|------|------|-----------------|
| 打开 Sheet，卡片滑入时内容在卡片里**额外滑约 60px 再回弹**；标题不动 | ① 外层有原生 Tab（`TabsScreen`）时，RNS 在原生栈挂载时把首个 ScrollView 的 `contentInsetAdjustmentBehavior` 从 `never` **强制改成** `automatic` → 系统栏显示即加 ~64px inset。② `GlassMaskScrollEdgeHost` 每次挂载须先**显示**系统栏测高、测到再**隐藏**；隐藏与宿主响应同一提交 → UIKit 动画把 inset / offset 变化做成滑动 | ① `EgSheets` 每次呈现先以 `automatic` 挂载（RNS 只改写 `never`），收到栏高（原生栈已挂好）再切 `never` 并 `scrollTo(0)`，期间内容透明。② Host 测到栏高后**晚两帧**再隐藏系统栏 |

**排查要点**：

- 不是业务布局问题 — 改业务 `margin` / `padding` 无效（本次先错改快捷入口外边距，已撤回）。
- 区分「RN 侧值在变」还是「原生在推」：DS 内临时打 `contentTopInset` / `nativeEdgeHeight` 日志；若 RN 值稳定而内容仍动 → 查 ScrollView `onScroll` 的 `contentOffset`（本例切换前 `-64`）。
- `axe describe-ui` 看元素 frame：ScrollArea 位置正常而内部文本下移 = **content inset**，不是布局。
- 系统栏首帧可能回传含状态栏的高度（实测 116 → 64），只用最终值。

**【禁止】**

- 把 ScrollView 移出 RNS「首个子视图链」来躲强制 `automatic` — scroll edge 效果也靠同一条链找 ScrollView，会一起失效。
- 业务侧关 `TabsScreen` 的 `overrideScrollViewContentInsetAdjustmentBehavior` — 影响所有 Tab 页的滚动 inset。
- 只靠「透明到测得栏高」遮盖 — 挡不住随后的系统栏隐藏动画。
- 在同一提交里「隐藏系统栏 + 改 ScrollView inset 行为」。

### 12.9 iOS 26+ · `EgTabBlock` 正文区点击全无（2026-11-13）

| 现象 | 根因 | 正解（DS） |
|------|------|-----------|
| 首页待办 / 通知等含 `EgTabBlock` `children` 的列表 **`Pressable` 点不动**，左右滑切仍可用 | 正文区 Pan 在 iOS 26 原生 Nav/Tab 栈下抢过 RN 点按 | DS `useEgHorizontalSegmentSwipe`：`activeOffsetX` + `failOffsetY` + `cancelsTouchesInView(false)`（见 dist `egHorizontalSegmentSwipeCommit.js`） |

| 手指落在列表上**上下滚不动** | 横向 Pan 未设纵向 fail 阈值，与外层 ScrollView 抢手势 | 同上 · 以当前 dist 常量为准；业务勿再包一层 `Gesture.Pan` |
| 列表下方空白处**左右滑不切** | 手势宿主只有正文内容高 | DS：`EgTabBlock` 正文 `flexGrow: 1` 撑满；业务**从滚动容器到 `EgTabBlock` 每一层**都要 `flexGrow: 1`（`SceneScaffold` content · 首页 `content` + `todoSection`）。验证：临时给 dist 里 `bodyGestureHost` 加半透明底色看是否铺到底 |
| 正文右滑与整页返回抢手势 | `EgEdsAnimaPage` 整页任意位置拖拽返回 | DS：仅屏幕左缘侧滑返回（iOS 26+ `fullScreenGestureEnabled: false`） |
| Android · iOS ≤25 右滑后**页面右缘往左走一段**（越过原位露底再弹回） | 侧滑未达阈值松手 → open spring 继承手势速度弹回原位而越位；拖动中回拉过起点同理 | DS：`EgEdsAnimaPage` 每路由 `gestureSettle`（`gestureStart` 置 1 → `transitionEnd` 复 0），期间上层页位移夹取在 [原位, 离场位]。**【必须】** 推入 / 返回的 spring 轻回弹保留（`page-push` · `page-pop` 不改临界阻尼、不 `overshootClamping`）— 回弹是 page 动效本体 |
| 改了 DS、重建后**业务仍是旧效果** | 旧 assemble 整目录 rename 换 dist → Metro 监听不到，持续供旧模块 | DS `assemble.mjs` 已改为**逐文件**临时文件 + rename；验证：`curl` Metro bundle `grep` 新代码。遇到旧 Metro 先 `--clear` 重启一次 |

**【禁止】** 业务长期 `contentSwipeToSwitch={false}` 当最终方案（可临时对照验证）。
