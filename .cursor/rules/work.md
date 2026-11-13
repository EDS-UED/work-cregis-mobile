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
设计系统    → ../eds-mobile/**   本仓禁止改；怎么改都不默认牵动业务（§3.1）
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
| **「推送」/「推」** | **必须**执行 §3.3 双仓 push + 确认 EAS `preview` update 成功（Agent 亲自跑命令，不只给文案） |
| Expo Go 与项目 SDK 不一致 | 先确认 `package.json` / `work.md` §1 锁定版本；真机 Go 过旧/过新 → 模拟器或 Dev Client（§1） |
| 只提业务 Scene / 功能 | 只改 `src/**`（及 i18n / navigation / store）；**新页必读 §2.5**；**改 Home 顶栏必先读 §2.3.1**，禁止未读就改 overlay / reserve / `forceRnImplementation` |
| **设计 / 生成新页面** | **参考** [`docs/design.md`](../docs/design.md) §5.0（非强制改造既有页） |
| 只提 token / Eg 组件行为 | **禁止改** `../eds-mobile/**`（**须先询问授权**，见 §3.1）；未授权则 §3.1.1 反馈或业务 workaround，勿手搓 Eg*（§3.1） |
| **「同步」** | **唯一**授权 §3.1.2：拉最新 `@eds-evergreen/mobile` dist（**非** §3.3「推」）。**禁止** DS 有改动就 build / 改业务 import / 清 Metro — 未说「同步」则业务按**当前 dist** 继续，不受影响 |

**收尾**：两三句——做了什么、还需什么、验证过没过。**禁止**复述全过程。

**心里有数**：`../eds-mobile` 改了 ≠ 本仓要更新；只有用户 **「同步」** 才拉 dist。**「推」** 走 §3.3（Git / EAS），与 **「同步」** 不是一回事。区分「本次引入」与「预先存在」。

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
| 仓库边界、dev、Git/pin | §3 |
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

**集成契约（默认）**

Design system（`../eds-mobile`）可独立演进；**业务仓默认不跟、集成不受牵连** — 仍以 **当前已 resolve 的 `@eds-evergreen/mobile` dist** 为准开发与验 UI。只有用户在本会话说 **「同步」** 时，才在本仓执行 §3.1.2，拉齐**最新** assemble dist。

| 情况 | 业务 / Agent |
|------|----------------|
| eds-mobile 新 commit、改 Eg*、Showcase 已更新 | **不**自动 build、**不**改 `src/**` 追 API、**不**假定要对齐 Showcase 最新行为 |
| 红屏 / dist 缺 export | 用**当前 dist 已有**公开 API，或 §3.1.1 反馈 DS；**等**「同步」，**不**为修 UI 主动拉 dist |
| 用户说 **「同步」** | §3.1.2：`ensure-eds-mobile` → `npm install` → 必要时 Metro **`--clear`** |
| 用户说 **「推」/「推送」** | §3.3 Git / EAS；**不是**拉本地 dist |

| 本仓库可改 | 禁止改 |
|------------|--------|
| `src/**` · `docs/**` | `../eds-mobile/**`（整个设计系统仓库） |

**【禁止】业务侧 / 本仓库 Agent 更改 EDS 设计系统**，包括但不限于：

| 禁止行为 | 说明 |
|----------|------|
| 改 `../eds-mobile/**` 任意文件 | 组件、token、脚本、showcase、规则等 — **一律不在本任务里动** |
| 为修 Eg* / token 在 consumer 里「顺手改 EDS」 | 缺能力 → **停改**，说明属 eds-mobile，请用户在 **eds-mobile** 改完并 build |
| 手改 `node_modules/@eds-evergreen/mobile/dist/**` | dist 只来自上游 build + link；**禁止**当补丁目录改 |
| 未授权时在 consumer 会话里跑 `pnpm build:mobile` | 仅 **「同步」** 时 §3.1.2；**禁止** Agent 未说「同步」就 `ensure-eds-mobile` |

**【必须】** EDS 实现变更只在 **eds-mobile** 完成；本仓只做集成。**禁止**因上游改了就把业务 import、联调步骤、验收标准改成「必须最新 dist」。

**唯一例外 · 改 DS 须先授权（2026-11-13 起严格执行）**

| 步骤 | 要求 |
|------|------|
| 1 | 业务需要 Eg* / token / dist 不具备的能力 → **先说明原因与拟改范围**，**询问用户是否授权改 `../eds-mobile/**`** |
| 2 | 用户**未明确同意**（如「可以改 DS」「授权」）→ **只**走业务 workaround 或 §3.1.1 反馈清单，**禁止**动 DS |
| 3 | 用户**已授权** → 方可编辑 `../eds-mobile/**`；完成后须用户说 **「同步」** 再 §3.1.2 拉 dist（**禁止**未说「同步」就擅自 `build:mobile`） |

**【禁止】** 未经上表第 1–2 步直接改 DS（含 `EgSheets`、`EgNavBar`、token、glass 等），即使判断「业务侧无法做」也不行。

**【必须】** Agent 发现 Eg* / 液态玻璃 / 系统 Nav 与 Showcase 不一致时：**只更新本节 §3.1.1 清单（或告知用户增补）并口头反馈**，**禁止**为修 UI 去改 `../eds-mobile/**` 或在业务仓复制第二套玻璃实现。

### 3.1.1 EDS 联调 · 业务反馈清单（Cregis → eds-mobile）

**业务集成对齐（与当前 `@eds-evergreen/mobile` dist 一致 · 同步 2026-11-13 · eds-mobile `22080d1`）**

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
| Semantic **`radius-md` / `radius-lg`** | **列表行点按底** · DL · 设置行 → **`radius-md`**（20px · `scale-5`）；**分组白卡** → **`radius-lg`**（24px · `scale-6`）。与 Showcase `list row` / shallow card 语义一致 · `docs/design.md` §3 |
| **`EgTabBlock`** | 首页待办 / 通知胶囊分段 · `@/eds/tab-block`；`children` + `contentKey` 自带 layout-content 正文动效与左右滑切（对齐 `EgTab`）。独立正文区仍可用 **`useEgHorizontalSegmentSwipe`**。下划线样式用 **`EgTab`**。 |

**业务仓必保依赖**：`expo-glass-effect ~58` · Metro iOS **`expo-glass-effect` shim** · `@expo/ui ~58`（iOS 26+ `EgMenu` 走系统菜单，与 Showcase 一致；缺失则回退 RN 浮层）。要对齐 eds-mobile **最新** dist → 仅用户 **「同步」** §3.1.2。

**若真机仍发白 / 仍像 RN 白盒 — 先区分再反馈 DS**

| 场景 | 先验 | 可能归属 |
|------|------|----------|
| Home / 设置 **栏上胶囊**（`host="navigationBar"`） | 是否 **`hidesSharedBackground`** 每项都有；是否 **legacy `headerLeft`**（业务已禁止）；scroll edge：内容 **> 一屏** · `automatic` inset | DS / RNScreens 栏项材质 · 或 dist 未更新 |
| **浮层顶栏**（canvas `EgButtonGlass`） | `readEgButtonGlassStackDiagnostics()` → **`stack: 'rn'`** | 缺 `expo-glass-effect` 或未 `--clear` Metro → **工程**；闸门文档 → **DS** |
| **历史：双返回圈** | dist 是否含 **`unstable_headerLeftItems` 返回**（无 `headerLeft` 内嵌玻璃） | 旧 dist → 用户 **「同步」** §3.1.2 + 清 Metro |
| **`EgMenu` RN 浮层空白**（2026-11-12 · 已在 DS 修复并同步） | 原因：`EgMenuPanel` 内容放在 `absoluteFill` 里（面板高度 0），且 iOS `BlurView` 叠在内容之上把文字糊掉。修复：内容回到布局流、玻璃层置于内容之下 | 已修（eds-mobile `EgMenuAnchored.tsx`） |

**仍须 DS / Showcase 真机对标时附带**：机型 · iOS 版本 · diagnostics JSON · `host` / `iconCount` · 截图 · eds-mobile **commit**。

**转 DS 时附带**

- 机型 / **iOS 精确版本** / Expo Go 或 Dev Client  
- `readEgButtonGlassStackDiagnostics()` 完整 JSON  
- `kind` · `iconCount` · `host` · 截图（Home 左/右、设置返回）  
- 本仓 `@eds-evergreen/mobile` 对应 **eds-mobile commit / dist 构建时间**（**同步前**以当前 dist 为准，不以 eds-mobile `main` 最新为准）

**需要最新 dist 时**：用户说 **「同步」** → §3.1.2（Agent **勿**在修 Scene / bug 时顺带 build）。

### 3.1.2 同步（拉最新 EDS dist · 仅用户说「同步」）

**关键词「同步」** = 本节。**不是** §3.3 **「推送」/「推」**。

**【必须】** 用户说 **「同步」** 后，Agent 在本仓库：

1. `node scripts/ensure-eds-mobile.mjs`（必要时在 `../eds-mobile` 跑 `pnpm build:mobile`）
2. `npm install`（`file:` 直连 `../eds-mobile/packages/mobile`）
3. 若 Metro 已在跑或需验 UI：`npm run start:metro-only -- --clear`（**8081**）

```bash
cd work-cregis-mobile && node scripts/ensure-eds-mobile.mjs && npm install
kill -9 $(lsof -ti :8081) 2>/dev/null; npm run start:metro-only -- --clear
```

**【禁止】** 未说「同步」时 Agent 执行上列步骤 — 含「发现 dist 旧」「DS 刚改完」「要对齐 Showcase」等（见下表）。

| 情况 | Agent 应做 |
|------|------------|
| 发现 dist 比 eds-mobile 源码旧 | 告知用户；可选更新 §3.1.1；**等**用户说同步 |
| 红屏 / 缺 export（如 animations 未 export 某 helper） | 业务侧改用 dist **已导出** API，或 §3.1.1 反馈 DS；**不**为追新 dist 主动 build |
| 用户刚在 eds-mobile 改完组件 | **不**自动 `ensure-eds-mobile`；提示需要时说「同步」 |
| 联调、修 Home、用户只说「推」 | **不**用 push 代替「同步」；EAS 走 §3.3 |

**说明**：`npm start` 的 `prestart` / §3.2 EDS watch 是维护者**自愿**联调，**不改变 §3.1 集成契约** — Agent 仍只在用户说 **「同步」** 时拉 dist。日常验业务优先 **`npm run start:metro-only`**，避免无意 build 新 dist。

**链接方式（本地，非 npm）**：`package.json` → `"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"`（`package-lock.json` 应对应 `../eds-mobile/packages/mobile`，**不是** `registry.npmjs.org`）。**Metro 必为 linked 配置**（真源 `../eds-mobile/docs/consumer-metro.config.example.cjs`，本仓 `metro.config.js` 已合并 Cregis shim / `@/*`）；详案 **`../eds-mobile/docs/consumer-linked-dev.md`**。

### 3.2 dev 联调（可选 · 非默认集成）

**【默认】** 遵守 §3.1：**eds-mobile 改动不牵动业务集成**；要最新 dist 须用户 **「同步」**（§3.1.2）。验 Cregis Scene、Agent 改 `src/**` 时优先 **`npm run start:metro-only`**（不跑 `prestart` 自动 build）。

**【可选】** 维护者主动联调 DS + 业务时：`npm start`（**8081** · `prestart` → `ensure-eds-mobile.mjs` · 可并行 EDS `watch:linked-consumers`）。关 watch：`CREGIS_EDS_TOKEN_WATCH=0`。这**不等于**「DS 一改业务就该跟」— 仍须用户 **「同步」** 才视为正式拉齐 dist。Metro linked 配置见 **`docs/consumer-linked-dev.md`** · `metro.config.js`。

**Token / 玻璃（如 `.glass-button-box`）**：spec 变更经上述 watch 进 `packages/mobile/dist`；dist Metro 已 `watchFolders` dist/tokens + dist/components。**改 EDS 组件源码** → `CREGIS_EDS_LINKED_METRO=1 npm start` + Fast Refresh。

| 改了什么 | 怎么验 |
|----------|--------|
| `src/**` | Metro 保存即刷新 |
| `../eds-mobile` 组件源码 | linked Metro + Fast Refresh；**禁止**在 Cregis 仓改 `../eds-mobile/**` |
| EDS token / spec | EDS `watch:linked-consumers` → build:tokens → Metro reload |
| 首屏 / 全量 Reload 变慢 | 业务 **禁止** `@eds-evergreen/mobile` 主 barrel；用 `/nav-bar`、`/home-ui`、`/theme` 等；Metro **FileStore** 缓存 · 非 Home Tab / 个人中心延迟 `require` |
| 日常开发（要快 + 要实时） | **`npm start`** / **`npm run dev`**（默认不跑 ensure · EDS watch 开 · `src/**` Fast Refresh）；拉 dist 用 **`npm run start:with-ensure`** 或 **「同步」**；纯 Metro **`npm run start:metro-only`** |
| 仅 dist / 无 linked 入口 | 用户说 **「同步」** 后 §3.1.2；**禁止** Agent 主动 `ensure-eds-mobile`；**禁止**手改 `node_modules/@eds-evergreen/mobile/dist` |

不用联调时只关 Expo；勿长期留 EDS `watch:linked-consumers` / `dev:showcase` 占资源。

**依赖纪律**：`file:../eds-mobile/packages/mobile`；**未「同步」**前不追新 dist。业务只从 **`@/eds/*`** 引 Eg* / `mobileTheme`（内联 `src/shims/` → dist 细文件）；**禁止** `@eds-evergreen/mobile` 主入口；**禁止**业务直接写 `@eds-evergreen/mobile/xxx` 未在 package exports 声明的子路径。

**维护者自拉 dist（须先说「同步」或由 Agent 执行 §3.1.2）**

```bash
# 业务仓
npm install          # file: 直连 ../eds-mobile/packages/mobile
npm run typecheck
./node_modules/.bin/expo start --port 8081 --clear
```

**EAS / Preview（与 Metro 无关）**：`../eds-mobile` → `pnpm build:mobile`；本仓 → `npm run preview:update` 或 §3.3 Workflow。

Token 若含 `build:tokens`：`--blur-xs` / `--depth-xs` 等为 `var(--scale-1)`（4px），影响 inset 阴影观感。`EgNavBar` / `EgCregisTabBar` iOS 26+ **禁止** `forceRnImplementation` 绕过。

**【禁止】** 没开 dev、没目测，就声称 UI 已完成。

**问题上报（给 EDS）**：先填 **§3.1.1**；另附机型 / iOS 版本、`readEgButtonGlassStackDiagnostics()`、`kind` / `iconCount` / `host`、截图；对齐以 Showcase 同配置真机为准。

### 3.3 Git（双仓库）与 EAS 预览同步

**仓库**

| 仓库 | 远程 | 角色 |
|------|------|------|
| `work-cregis-mobile`（本仓） | `EDS-UED/work-cregis-mobile` | Cregis 业务 App |
| `../eds-mobile` | `EDS-UED/eds-mobile` | 设计系统；EAS 云端 **clone `main` 并 `pnpm build:mobile`** |

**Expo / EAS**

- Team：**theyangsongs-team**
- 项目显示名：**Cregis UED**（`app.config.ts` → `name`）
- Slug / Dashboard URL：**`eds-ued`**（勿与已删的个人 `@theyangsong/cregis-ued` 混淆）
- 同事预览：Expo Go → Dashboard **Deploy → Over-the-air updates** → 最新 **Preview** 二维码（channel **`preview`**）

**Agent 纪律（默认）**

- **【禁止】** 未经用户明确要求就 `git push` / `git commit`
- 用户未说 commit → **不得**提交

**用户说「推送」「推」「推上去」等 — 【必须】Agent 亲自完成**

目标：**GitHub `main` 与维护者本机一致**，且 **EAS `preview` 与本地 Metro 所见一致**（含 EDS dist）。

1. **预检（本仓）**  
   `npm run typecheck`；若有未提交改动，按任务范围 **commit**（双仓分别 commit，信息写清业务/EDS 边界）。

2. **顺序：先 EDS，后业务**  
   ```bash
   cd ../eds-mobile && git push origin main
   cd ../work-cregis-mobile && git push origin main
   ```  
   **【必须】** 先推 `eds-mobile`：EAS Workflow 在云端按 **`EDS_MOBILE_GIT_REF`（默认 `main`）** 拉设计系统；业务仓先推会导致同事短暂看到**旧 EDS + 新业务**的组合。

3. **触发 preview update**  
   - **首选**：`work-cregis-mobile` push 后 GitHub 触发 `.eas/workflows/publish-preview-update.yml`（channel `preview`）。  
   - **【必须】** 用 `npx eas-cli workflow:runs --limit 1` / `workflow:status <runId>` 等到 **SUCCESS**；失败则读 `workflow:logs` 修 CI 后重推。  
   - **兜底**：本机 `npm run preview:update`（仍须 eds-mobile 已在 GitHub `main`）。

4. **收尾告知用户**  
   给出 **Updates → Preview** 链接（`https://expo.dev/accounts/theyangsongs-team/projects/eds-ued/deployments` 或当次 update 页），并说明同事需 **Expo Go SDK 58**（与 `work.md` §1 锁定一致）。

**本地 link（不替代 push）**：用户 **「同步」** 或 §3.1.2 才对齐本机 dist；**同事只看 EAS**，不看 sibling 目录。

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
| Item 主文案（非 DL） | `typography-body-medium-strong` · primary → `bodyMediumStrong` |
| **Data list 主文案（DL-title）** | `typography-body-medium-heavy`（600）· primary → **`bodySemibold`**（`docs/design.md` §3.3） |
| 页边距 | 上 `spacing-4`（`EDS_NAV_CONTENT_GAP`）· 左右 `spacing-5`（`EDS_SCENE_CONTENT_INSET`）· 下 `spacing-8` |
| 块/卡片间距 | `spacing-7` |
| Item 内间距 | 标题–副文本 `spacing-1`；左图/头像/icon–文案 `spacing-3` |
| **Data list 行** | **行壳**距屏 **`spacing-2`（8px）** · 行内 **`spacing-3`（12px）** · 行间 **`spacing-1`（4px）** · `getDataListRowLayout()` + `dataListSectionStyle()`（§3） |
| 尺寸 | 头像/币种默认 `avatar-lg`（首页待办币种图 `avatar-xl`）；icon `symbol-md` |

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

### 5.1 Token 与圆角平滑

- 业务：`useEdsTheme()` + `edsPx()` + `src/utils/edsTheme.ts` 命名 helper（`edsPageBackground` · `edsSceneContentInset` · `createEdsTypographyStyles` / `SceneText` variant）
- **【必须】** Scene 水平内边距统一 `edsSceneContentInset(spacing)`（`EDS_SCENE_CONTENT_INSET` = **`spacing-5` / 20px**），禁止单页另写 `spacing-*` 当「全局边距」
- **【必须】** **Data list**：**行壳**（`DataListRow` 点按底）距屏幕左右 **`spacing-2`（8px）** = **`marginH`**（配 DL-bleed）；**不是**用 `padH` 顶到屏缘。行内 `padH`/`padV` **`spacing-3`（12px）**；行间 **`spacing-1`（4px）**。主文案距屏 = `marginH + padH`（`dataListScreenInset()`）。**DL-title** 字阶 **`typography-body-medium-heavy`（600）** → `SceneText variant="bodySemibold"`。单页例外 §3.4
- **【必须】** 导航底到首屏内容间距统一 `edsNavContentGap(spacing)`（`EDS_NAV_CONTENT_GAP` = **`spacing-4` / 16px**）；`SceneScaffold` · 首页 `HomeScene` 已接，新页勿另算
- 新页若采用 `docs/design.md`：下边距 `spacing-8`、块间距 `spacing-7`；水平边距仍以 `EDS_SCENE_CONTENT_INSET` 为全局左右标准（**不**因此对已有页做追溯替换）
- **【必须】** 语义色/字档走 `SceneText` variant 或 Eg* 的 color token prop（如 `text-base-secondary`），禁止 Scene 内 `color: '#…'` 或 `colors[...]` 拼一行覆盖（除非 variant 尚未收录 → 先补 `edsTheme`）
- **Cregis 品牌色**：浅/深均为 **`#1FC35A`** — 经 `getCregisThemeColors()` / `applyCregisBrandColors()` 覆盖 EDS `brand` 族；**iOS** 上 `material-brand` 等走 RN `{ space: 'display-p3' }`（`CREGIS_BRAND_DISPLAY_P3` · 与 spec `eds-success` 同源），**Android** 仍为 sRGB hex；勿在 Scene 手写绿 hex

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
| 文档版本 | 1.5 |
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

**【必须】** Sheet 内行保持 RN `Pressable`（`DataListRow`）；`contentPan = buildPan(contentScrollable)`（仅最高档且内容溢出时长按拖）。

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
| 首页待办 / 通知等含 `EgTabBlock` `children` 的列表 **`Pressable` 点不动**，左右滑切仍可用 | 正文外包 `Gesture.Pan()`（默认在 `BEGAN` 即占触摸）；iOS 26 原生 Nav/Tab 栈下 RN 点按不走 RNGH，Pan 占满 → 点击被吃掉 | `useEgHorizontalSegmentSwipe` · `manualActivation(true)` + `cancelsTouchesInView(false)`，横向超过阈值才 `activate`；轻点才交给子级 |

| 手指落在列表上**上下滚不动** | `manualActivation(true)` 的 Pan 落指即 BEGAN，UIKit 判它赢过外层 ScrollView 的 pan | DS：改 `activeOffsetX ±20` + `failOffsetY ±12`（纵向先失败）+ `cancelsTouchesInView(false)`；**禁止**再用 `manualActivation` |
| 列表下方空白处**左右滑不切** | 手势宿主只有正文内容高 | DS：`EgTabBlock` 正文 `flexGrow: 1` 撑满；业务**从滚动容器到 `EgTabBlock` 每一层**都要 `flexGrow: 1`（`SceneScaffold` content · 首页 `content` + `todoSection`）。验证：临时给 dist 里 `bodyGestureHost` 加半透明底色看是否铺到底 |
| 正文右滑与整页返回抢手势 | `EgEdsAnimaPage` 整页任意位置拖拽返回 | DS：仅屏幕左缘侧滑返回（iOS 26+ `fullScreenGestureEnabled: false`） |
| Android · iOS ≤25 右滑后**页面右缘往左走一段**（越过原位露底再弹回） | 侧滑未达阈值松手 → open spring 继承手势速度弹回原位而越位；拖动中回拉过起点同理 | DS：`EgEdsAnimaPage` 每路由 `gestureSettle`（`gestureStart` 置 1 → `transitionEnd` 复 0），期间上层页位移夹取在 [原位, 离场位]。**【必须】** 推入 / 返回的 spring 轻回弹保留（`page-push` · `page-pop` 不改临界阻尼、不 `overshootClamping`）— 回弹是 page 动效本体 |
| 改了 DS、重建后**业务仍是旧效果** | 旧 assemble 整目录 rename 换 dist → Metro 监听不到，持续供旧模块 | DS `assemble.mjs` 已改为**逐文件**临时文件 + rename；验证：`curl` Metro bundle `grep` 新代码。遇到旧 Metro 先 `--clear` 重启一次 |

**【禁止】** 业务长期 `contentSwipeToSwitch={false}` 当最终方案（可临时对照验证）。
