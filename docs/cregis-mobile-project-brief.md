# Cregis Mobile — 项目说明与 Motion 使用指南

> **版本**：v1.0  
> **日期**：2026-09-15  
> **仓库**：`work-cregis-mobile`  
> **读者**：Cregis Mobile 工程、设计系统协作、Cursor / AI

---

## 文档结构

| 部分 | 内容 | 职责归属 |
|------|------|---------|
| **§A** | 设计系统 Motion 资料（真源、分层、参数） | **EDS Mobile**（`eds-mobile`） |
| **§B** | 项目侧完整情况（架构、约定、交付） | **work-cregis-mobile** |
| **§C** | 项目如何使用 Motion（仅使用，不定义） | **work-cregis-mobile** |

**核心边界**：

> **Motion 的定义、token、组件内动效 — 是设计系统的职能。**  
> **work-cregis-mobile 只负责正确引用、导航编排、业务场景组装与 Dev Inspect 读取。**

---

# §A 设计系统 Motion 资料（EDS Mobile）

## A.1 仓库与包

| 项 | 值 |
|----|-----|
| 设计系统仓库 | `~/Projects/eds-mobile` |
| Figma | [EDS Mobile](https://www.figma.com/design/LlB2jT8KdxM6taf5wOSAEM/) · fileKey `LlB2jT8KdxM6taf5wOSAEM` |
| Consumer 依赖方式 | **本地 path** → `@eds-evergreen/mobile` |
| 规范真源 | `eds-mobile/.cursor/rules/work.mdc` · `AGENTS.md` |

### 包分层

| 包 | npm 名 | Motion 相关职责 |
|----|--------|----------------|
| Tokens | `@eds/mobile-tokens` | Motion Base / Recipe / Semantic 的 JSON + CSS 构建产物 |
| Animations | `@eds/mobile-animations` | **RN 运行时 preset**（spring / timing → Reanimated） |
| Components | `@eds/mobile-components` | 202 个 `Eg*` 组件；**组件内 press / 形变动效由 DS 实现** |
| 统一出口 | `@eds-evergreen/mobile` | 聚合发布；consumer 主要 import 此包 |

```ts
// Consumer 推荐 import 方式
import { mobileMotion, EgCregisTabBar, mobileTheme } from '@eds-evergreen/mobile';
import { mobileMotion } from '@eds-evergreen/mobile/animations';
```

### Peer 依赖（EDS 要求 consumer 具备）

```text
react >= 18
react-native >= 0.74
react-native-svg >= 15
react-native-reanimated >= 3
react-native-gesture-handler   （EDS 组件与 App 手势编排）
```

---

## A.2 Motion 真源文件（设计系统维护）

```text
eds-mobile/packages/tokens/spec/motion/
├── base.json           # 物理量：duration / easing / offset / scale
├── recipe.json         # 配方：duration role + easing + property 组合
├── semantic.json       # 场景语义 class（Ease / Layout / Flotation / Deform / Page …）
└── ios-native.json     # RN Reanimated 执行参数（spring / timing）

eds-mobile/packages/tokens/dist/css/motion/   # 构建 CSS（Showcase 文档用）
├── index.css
├── base.css
├── recipe.css
├── semantic.css
└── utilities.css

eds-mobile/packages/mobile-animations/src/
└── index.ts            # 导出 mobileMotion（由 ios-native.json 驱动）
```

**维护流程**（设计系统侧）：

1. Figma Mobile 变量更新 → `node packages/tokens/scripts/import-mobile-figma.mjs`
2. `pnpm build:tokens`
3. 若组件动效变更 → `pnpm build:components` · `pnpm build:mobile`
4. Consumer 通过 `pnpm sync` / 本地 link 更新

**Consumer 禁止**：修改上述 spec；禁止在 consumer 私造 motion token。

---

## A.3 Motion 四层模型

```text
Base（物理量）
  ↓ 组合
Recipe（配方）
  ↓ 命名场景
Semantic（场景 class · 业务选场景）
  ↓ RN 映射
iOS-Native（Reanimated preset · App 运行时入口）
```

### A.3.1 Base — 物理量

> 真源：`base.json` · CSS 变量前缀 `--eds-motion-*` / `--motion-*`

**Duration 阶梯**

| Token | 值 | 说明 |
|-------|-----|------|
| `eds-motion-0` | 0ms | 即时 / Reduced Motion |
| `eds-motion-1` | 100ms | 微交互 |
| `eds-motion-2` | 150ms | 淡入淡出 |
| `eds-motion-3` | 200ms | 浮层进入 |
| `eds-motion-4` | 300ms | 常规过渡 |
| `eds-motion-5` | 600ms | 强调 |
| `eds-motion-6` | 500ms | 页面级推动 |
| `eds-motion-8` | 250ms | Tab 滑块 / Toggle |
| `eds-motion-9` | 350ms | 反馈 / 容器 morph |
| `eds-motion-10` | 800ms | Spinner |
| `eds-motion-11` | 2000ms | 慢 Spinner |
| `eds-motion-12` | 180ms | 内容 crossfade |

**Easing**

| Token | 角色 |
|-------|------|
| `eds-motion-ease-1` | 对称 ease-in-out |
| `eds-motion-ease-2` | 进入 |
| `eds-motion-ease-3` | 离开 |
| `eds-motion-ease-4` | Material / 控件 |
| `eds-motion-ease-5` | 线性（Spinner） |
| `eds-motion-ease-6/7` | 弹性反馈 |
| `eds-motion-ease-8` | 减速渐隐 |

**物理状态量**

| Token | 值 | 含义 |
|-------|-----|------|
| `motion-opacity-hidden/visible` | 0 / 1 | 显隐 |
| `motion-scale-flotation-enter` | 0.96 | 浮层入场缩放 |
| `motion-offset-small` | 8px | 小位移 |
| `motion-offset-flotation-y` | -10px | 浮层入场 Y |
| `motion-offset-page-push` | 30% | 页面推动 |

---

### A.3.2 Recipe — 配方

> 真源：`recipe.json` · CSS `--motion-recipe-*`

将 duration role + easing + 属性束拼成可复用 transition 配方。

**常用 Recipe（Mobile 相关）**

| Recipe | Mobile 含义 |
|--------|------------|
| `motion-recipe-enter` | 面板进场 |
| `motion-recipe-exit` | 面板退场 |
| `motion-recipe-flotation-enter` | Sheet / Modal / Toast 进场 |
| `motion-recipe-flotation-exit` | 浮层退场 |
| `motion-recipe-page-push` | 页面转场（语义层） |
| `motion-recipe-control` | Tab 指示器 / Toggle 形变 |
| `motion-recipe-fade` | 淡入淡出 |
| `motion-recipe-shift` | 布局位移 / Swipe 露出 |
| `motion-recipe-layout-deform-shell` | 容器 morph（shell） |
| `motion-recipe-layout-deform-content` | 容器 morph（内容） |
| `motion-recipe-scroll-fade` | 滚动渐隐遮罩 |

**Desktop/Web 专用 Recipe（Mobile App 不使用）**

| Recipe | 原因 |
|--------|------|
| `motion-recipe-hover` | 无 hover |
| `motion-recipe-hover-asym` | 无 hover |
| `motion-recipe-float` | Web hover 微浮动 |

**Reduced Motion**：`recipe.json` 内 `reducedMotionOverrides` — 系统开启「减少动态效果」时 duration 全部降为 `0ms`。

---

### A.3.3 Semantic — 场景语义

> 真源：`semantic.json` · CSS class `.motion-*`

设计系统用 **场景 class** 表达「这类 UI 该用什么动效语义」。  
Mobile 交互术语：**点按、手势、转场、浮层**（不用 hover / mouseleave）。

**Mobile 适用的 Semantic**

| Class | Mobile 术语 | 典型 UI |
|-------|------------|---------|
| `motion-page` | 页面转场 | Stack Push / Pop |
| `motion-flotation` | 浮层进出场 | Sheet、Modal、Toast、ActionSheet |
| `motion-layout` | 大位移面板 | Drawer、全屏 Panel |
| `motion-deform` | 控件形变 | Tab 指示器、Toggle、Segmented Control |
| `motion-layout-deform` | 容器 morph | Sheet 内 A↔B 页高度变化 |
| `motion-none` | 无动画 | 选中态即时切换 |

**Mobile 不适用的 Semantic（保留在 DS JSON 供 Desktop/Web Showcase）**

```text
motion-ease
motion-ease.is-hover
motion-ease.is-hover-enter-only
motion-ease.is-asym
motion-ease.is-focus
```

EDS Mobile 专项约定（`work.mdc` §6）：Event 语义为 **`event-tap*`**，非 Desktop 的 `event-hover`。

---

### A.3.4 iOS-Native — RN 运行时 Preset

> 真源：`ios-native.json` · 包 `@eds/mobile-animations`

```ts
import { mobileMotion } from '@eds/mobile-animations';

mobileMotion.spring.default    // Modal / Sheet
mobileMotion.spring.snappy     // Press / Toggle / Tab 指示器
mobileMotion.spring.gentle     // 容器 morph
mobileMotion.spring.bouncy     // Pull-to-refresh

mobileMotion.timing.navigationPush  // Stack Push 曲线
mobileMotion.timing.easeInOut       // 主题切换等
mobileMotion.timing.easeOut
mobileMotion.timing.easeIn
```

**Spring 参数表**

| Preset | damping | stiffness | mass | DS 用途说明 |
|--------|---------|-----------|------|------------|
| `default` | 18 | 220 | 1 | Modal / sheet 默认 spring |
| `snappy` | 22 | 320 | 0.9 | Button press / toggle |
| `gentle` | 20 | 160 | 1 | Large content morph |
| `bouncy` | 12 | 180 | 1 | Pull-to-refresh / overscroll |

**Timing 参数表**

| Preset | duration | easing (-bezier) | DS 用途说明 |
|--------|----------|------------------|------------|
| `navigationPush` | 350ms | (0.32, 0.72, 0, 1) | Navigation push |
| `easeInOut` | 350ms | (0.42, 0, 0.58, 1) | UIView 标准 |
| `easeOut` | 300ms | (0, 0, 0.58, 1) | 离场 |
| `easeIn` | 250ms | (0.42, 0, 1, 1) | 进场 |

**Semantic → Preset 映射（设计系统定义，consumer 遵循）**

| Semantic | 推荐 Preset |
|----------|-------------|
| `motion-page` | `timing.navigationPush` |
| `motion-flotation` | `spring.default` |
| `motion-deform` | `spring.snappy` |
| `motion-layout-deform` | `spring.gentle` |
| 下拉刷新 | `spring.bouncy` |
| 主题 fade | `timing.easeInOut` |

---

## A.4 组件层动效（设计系统职责）

| 规则 | 说明 |
|------|------|
| 引擎 | `react-native-reanimated` + `@eds/mobile-animations` preset |
| 实现位置 | `eds-mobile/packages/components/**` |
| 当前状态 | 202 组件多为 Figma 对齐 **scaffold**；场景组件（如 `EgCregisTabBar`）升级时 **动效在 DS 内锁 preset** |
| Consumer | 使用 `Eg*` 组件；**不在 consumer 手搓 Button press 动画** |

业务相关 preset 示例：

| 组件 | export | 说明 |
|------|--------|------|
| Cregis TabBar | `EgCregisTabBar` | Tab 栏场景封装 |
| Notes Popover | `EgNotesPopover` | 备注浮层 |
| … | catalog 202 项 | 见 `figmaCatalog.ts` |

缺失组件或动效 → **向设计系统提需求**，不在 consumer 平行实现。

---

## A.5 设计系统文档与 Preview 入口

| 入口 | 用途 | 栈 |
|------|------|-----|
| `pnpm dev:playground` | **RN 组件 live preview 真源** | Expo / Simulator / 真机 |
| Showcase `:5178` | Token / Animations / Components 文档 IA | Vue 过渡壳（**非 RN 运行时真源**） |
| Showcase → Animations | ios-spring-* / ios-navigation-push 文档 | 对照 catalog |

Consumer 动效问题排查顺序：

1. `@eds/mobile-animations` preset 是否存在  
2. 对应 `Eg*` 组件 DS 是否已实现动效  
3. App 导航层是否正确引用 preset（§C）

---

# §B 项目侧完整情况（work-cregis-mobile）

## B.1 项目定位

| 项 | 决定 |
|----|------|
| 产品 | Cregis 跨平台 Mobile App（Crypto 方向） |
| 仓库 | `work-cregis-mobile`（**从零搭建**） |
| 与 Desktop | **业务完全独立** — 不对标 `work-cregis-desktop` 业务架构 |
| 核心原则 | **一套 RN 业务代码** → iOS / Android / Browser Preview |
| App 名称 | `cregis`（Logo 后续提供） |
| Bundle ID 等 | 工程侧按常规处理（如 `com.cregis.app`） |

---

## B.2 技术栈

| 层 | 选型 |
|----|------|
| 框架 | React Native + **Expo（最新稳定 SDK）** + TypeScript |
| Browser Preview | React Native Web + Mobile Device Frame |
| 真机 / 模拟器 | **Expo Development Build**（长期正式开发客户端；Expo Go 仅快速原型） |
| 构建 | Local Build + Metro + Fast Refresh；**EAS 不强制** |
| 导航 | **React Navigation**（Tab + Native Stack） |
| 状态管理 | **Zustand**（域 store）+ **Hooks**（流程 /  ephemeral UI） |
| 设计系统 | 本地 `@eds-evergreen/mobile`（`eds-mobile`） |
| Token / Motion | **完全依赖 DS**；缺失须确认，**禁止 consumer 自建** |
| API | **Mock 优先**；结构预留 REST / WebSocket |
| i18n | **zh-CN** 语义基准 → **en-US** 主语言 → 繁体等；Tab 文案 **i18n key 化**（暂：主页 / 协作 / 资产 / WaaS项目 / 我的） |

---

## B.3 双预览体系

```text
                    同一套 RN 业务代码
                              │
              ┌───────────────┴───────────────┐
              ↓                               ↓
       Browser Preview                  Native Runtime
    （RN Web · 设备框 · Inspect）      （Dev Build · Simulator / 真机）
```

| 通道 | 职责 |
|------|------|
| **Browser Preview** | UI / 交互预览 · Dev Mode / Inspect · Cursor 上下文 |
| **Simulator / 真机** | Native API · Biometrics · Secure Storage · 手感验收 |

**Browser 与动效**：不维护第二套动效实现；Browser 里渲染成什么样，就是 RN Web 对**同一代码**的呈现结果。不为 Preview 单独设计或调参。

---

## B.4 目录结构（项目侧）

```text
work-cregis-mobile/
├── app/                      # Expo entry
├── src/
│   ├── scenes/               # 业务场景页（非设计系统）
│   │   ├── home/
│   │   ├── collaboration/
│   │   ├── assets/
│   │   ├── waas/
│   │   └── profile/
│   ├── navigation/           # Tab + Stack 配置
│   ├── hooks/                # 流程编排（Signing 类流程等）
│   ├── services/             # Mock / Native adapters
│   │   ├── biometrics/
│   │   ├── secureStorage/
│   │   └── api/
│   ├── store/                # Zustand stores
│   ├── i18n/
│   ├── assets/
│   └── utils/
├── browser-preview/          # 设备框 · Preview 壳
├── dev-mode/                 # Inspect（对齐 Desktop shell-debug 模型）
├── docs/                     # 项目文档（本文档）
├── scripts/
├── ios/
├── android/
└── package.json

❌ 无 src/components/   → UI 用 @eds-evergreen/mobile 的 Eg*
❌ 无 src/screens/      → 业务用 src/scenes/
❌ 无 src/theme/        → 颜色/间距用 DS token；主题偏好进 store
❌ 无 motion token 定义 → Motion 归 eds-mobile（§A）
```

---

## B.5 五 Tab 骨架（暂定 copy，i18n key 化）

| Tab | 场景目录 | 说明 |
|-----|---------|------|
| 主页 | `scenes/home/` | 汇总占位 |
| 协作 | `scenes/collaboration/` | 审批 / 签名等后续 |
| 资产 | `scenes/assets/` | 资产列表 / 汇总 |
| WaaS项目 | `scenes/waas/` | 项目管理 |
| 我的 | `scenes/profile/` | 设置 · 语言 · **主题** · 账号 |

Tab 栏组件：**`EgCregisTabBar`**（来自设计系统，非 consumer 手搓）。

---

## B.6 Zustand 域划分

| Store | 职责 |
|-------|------|
| `useAppStore` | locale · **themePreference**（light / dark / system）· 全局 loading |
| `useAuthStore` | 登录态（Mock → 真 API） |
| `useHomeStore` | 主页汇总 |
| `useCollaborationStore` | 协作列表 + 实体 cache |
| `useAssetsStore` | 资产 |
| `useWaasStore` | WaaS 项目 |
| `useProfileStore` | 账号偏好 |
| `useDevInspectStore` | Browser Inspect 壳外态 |

**不进 store**：弹窗步骤、动画 progress、scroll 位置、表单草稿 → Hooks + Reanimated sharedValue。

---

## B.7 主题（light / dark / system）

| 项 | 说明 |
|----|------|
| 颜色 token | `@eds/mobile-tokens` · `getThemeColors(mode)` / `mobileTheme` |
| 用户偏好 | `useAppStore.themePreference`：`light` \| `dark` \| `system` |
| 系统跟随 | `useColorScheme()` + 偏好为 `system` 时解析 |
| 持久化 | SecureStore（Native）/ localStorage（Browser Mock 层） |
| 切换动效 | 使用 DS `mobileMotion.timing.easeInOut`（§C） |
| 禁止 | consumer 自建 color token |

---

## B.8 Native Adapters（Mock + 真机 + 预留）

| 模块 | Browser | Native | 说明 |
|------|---------|--------|------|
| **Biometrics** | Mock 流程可预览 | `expo-local-authentication` | **首版搭 adapter + 预留扩展** |
| **Secure Storage** | Mock | SecureStore / Keychain 等 | 与 Biometrics 配套 |
| **Wallet SDK** | Mock | 后续 Dev Build 集成 | 接口预留，首版不硬上 |

架构：

```text
Scene / Hook
     ↓
services/* (interface)
     ↓
├── *.mock.ts    ← Browser
└── *.native.ts  ← iOS / Android
```

---

## B.9 Dev Inspect（壳外工具）

| 项 | 说明 |
|----|------|
| 参考 | `work-cregis-desktop/src/dev/shell-debug/` 能力模型 |
| 原则 | **壳 ↔ 业务双向隔离**；Inspect 只读，不改业务 layout / API |
| Motion 行 | 展示节点 **Semantic 场景名 + DS preset**（§C.4） |
| 术语 | Mobile 用语；不展示 hover 类 semantic |

---

## B.10 职责边界总表

| 职能 | 设计系统（eds-mobile） | 项目（work-cregis-mobile） |
|------|------------------------|---------------------------|
| Motion token 定义 | ✅ Base / Recipe / Semantic / ios-native | ❌ |
| `mobileMotion` preset | ✅ | 只 import 使用 |
| 组件内 press / 形变 | ✅ `Eg*` 内实现 | ❌ 手搓平行组件 |
| Stack / Tab 导航结构 | ❌ | ✅ React Navigation |
| 页面转场配置 | preset 由 DS 提供 | ✅ 在 navigation 引用 preset |
| Sheet 拖拽编排 | preset 由 DS 提供 | ✅ hooks + Gesture Handler |
| 业务 Scene | ❌ | ✅ `src/scenes/` |
| Biometrics / API | ❌ | ✅ `src/services/` |
| Browser Preview 壳 | ❌ | ✅ `browser-preview/` |
| Inspect 工具 | ❌ | ✅ `dev-mode/` |
| 缺失 token / 组件 | ✅ 设计系统补 | ⏸ 停改，先确认 |

---

## B.11 首版交付范围

### 必做

- [ ] Expo + RN + TS + Dev Build 配置
- [ ] RN Web Browser Preview（设备框 + Preview）
- [ ] Dev Inspect 基础壳 + Motion 行
- [ ] React Navigation 五 Tab + `EgCregisTabBar`
- [ ] Zustand store 骨架 + Mock services
- [ ] Biometrics + SecureStorage adapters（Mock + Native + 预留）
- [ ] 主题 light / dark / system
- [ ] i18n 基础（zh-CN / en-US key）
- [ ] `@eds-evergreen/mobile` 本地 link
- [ ] 导航层正确引用 DS motion preset（§C）
- [ ] README 启动说明

### 首版不做

- 复制 Desktop 业务页
- consumer 自建 design / motion token
- 真实 API / 完整 Wallet SDK
- 202 组件全量接入（占位 + DS 打通即可）

---

## B.12 禁止事项（项目侧）

```text
❌ 修改 eds-mobile/packages/tokens/spec/motion/*
❌ consumer 内 withSpring({ damping: 18, ... }) 硬编码
❌ 手搓与 Eg* 平行的 TabBar / Button / Sheet 组件
❌ 为 Browser Preview 单独维护一套动效代码
❌ 用 hover / focus 术语描述 App 动效
❌ 缺失 DS 能力时擅自硬编码样式或 token
```

---

# §C 项目如何使用 Motion（仅使用）

## C.1 项目侧动效引擎（运行时依赖）

Consumer 工程需集成（服务于 DS 组件 + App 导航）：

| 依赖 | 项目侧职责 |
|------|-----------|
| `react-native-reanimated` | 配置 babel plugin；**不写 preset** |
| `react-native-gesture-handler` | 根节点 `GestureHandlerRootView` |
| `@react-navigation/native-stack` | Stack Push/Pop / Modal presentation |
| `@eds/mobile-animations` | **唯一 preset 入口** |

项目 **不** 维护 `src/motion/presets.ts` 复制 token 定义；只在必要时做 **薄 helper**（如 `runEdsSpring('default')` → 转发 `mobileMotion`）。

---

## C.2 三类动效由谁实现

| 类型 | 示例 | 实现方 |
|------|------|--------|
| **组件内动效** | 按钮 press、Toggle、Tab 指示器 | **设计系统 `Eg*`** |
| **导航转场** | Stack Push/Pop、Modal 呈现 | **项目 navigation**（参数来自 DS） |
| **业务编排** | 打开 Sheet、Biometric 弹层流程 | **项目 hooks**（spring 来自 DS） |

---

## C.3 导航转场（项目侧主要动效工作）

```text
Root TabNavigator
  └── 每 Tab → NativeStackNavigator
        ├── List Scene
        ├── Detail Scene    ← Push（motion-page 语义）
        └── Sheet Scene     ← Modal（motion-flotation 语义）
```

| 层级 | 动画策略 | DS Preset |
|------|---------|-----------|
| Tab 切换 | 无或极轻 fade | — |
| Stack Push/Pop | Native Stack 默认 + 曲线对齐 | `timing.navigationPush` |
| Modal / Sheet | `presentation: modal / formSheet` 或自定义 Sheet | `spring.default` |
| 侧滑返回 | `gestureEnabled: true` | Native Stack 内置 |

```ts
// ✅ 项目 navigation 层 — 引用 DS，不定义参数
import { mobileMotion } from '@eds-evergreen/mobile/animations';

// Native Stack screenOptions 对齐 DS timing（示意）
transitionSpec: {
  open: { animation: 'timing', config: mobileMotion.timing.navigationPush },
  close: { animation: 'timing', config: mobileMotion.timing.navigationPush },
}
```

```ts
// ✅ Sheet hook — 引用 DS spring
import { mobileMotion } from '@eds-evergreen/mobile/animations';
translateY.value = withSpring(0, mobileMotion.spring.default);

// ❌ 禁止
withSpring(0, { damping: 18, stiffness: 220 });
```

---

## C.4 Dev Inspect — Motion 行（项目侧展示）

Inspect **读取**设计系统语义，不定义新 semantic：

```text
Motion
scene: motion-flotation
preset: spring.default · @eds/mobile-animations
```

```text
Motion
scene: motion-page
preset: timing.navigationPush · @eds/mobile-animations
```

无声明 → 显示 **「无」**；不继承祖先；不用 hover 类名。

---

## C.5 App 场景 → 设计系统对照

| Cregis 场景 | DS Semantic | DS Preset | 项目侧工作 |
|------------|-------------|-----------|-----------|
| Tab 内进详情 | `motion-page` | `timing.navigationPush` | Stack screenOptions |
| 底部 Sheet | `motion-flotation` | `spring.default` | navigation 或 Sheet hook |
| Tab 指示器 | `motion-deform` | `spring.snappy` | 用 `EgCregisTabBar`（DS 实现） |
| 主按钮点按 | （组件内） | `spring.snappy` | 用 DS Button，不手搓 |
| Biometric 弹层 | `motion-flotation` | `spring.default` | hook + adapter |
| 主题切换 | fade | `timing.easeInOut` | appStore + DS colors |
| 下拉刷新 | — | `spring.bouncy` | 列表集成（后续） |
| Reduced Motion | 全部降级 | duration → 0 | `AccessibilityInfo` |

---

## C.6 缺失能力时的流程

```text
1. 查 eds-mobile 是否已有 token / Eg* 组件
2. 查 playground / Showcase Animations 文档
3. 若无 → 停改 consumer，向负责人确认：
   - 是否扩展 eds-mobile？
   - 是否临时豁免（极少见，且仍禁止硬编码 token）？
4. 设计系统补齐 → pnpm sync → consumer 升级依赖
```

---

## C.7 Browser / Native 统一代码

```text
同一 Scene 代码 + 同一 mobileMotion import
              │
    ┌─────────┴─────────┐
    ↓                   ↓
 Native              RN Web
 真机验收手感          渲染即结果
```

项目不为 Browser 写 `.web.motion.ts` 平行 preset；若 RN Web 渲染差异，接受为同一实现的呈现，Native 仍为产品手感基准。

---

# 附录

## 附录 1 — Mobile 动效术语

| 使用 | 避免 |
|------|------|
| 点按 / 按压（Press） | hover |
| 松手（Release） | mouseleave |
| 页面转场 / Push / Pop | CSS transition 口吻 |
| 浮层 / Sheet / Modal | 未解释的 flotation |
| 侧滑返回 | — |
| 拖拽关闭 | — |
| 减少动态效果 | — |

## 附录 2 — 设计系统文件索引

| 内容 | 路径 |
|------|------|
| Motion Base | `eds-mobile/packages/tokens/spec/motion/base.json` |
| Motion Recipe | `eds-mobile/packages/tokens/spec/motion/recipe.json` |
| Motion Semantic | `eds-mobile/packages/tokens/spec/motion/semantic.json` |
| iOS-Native | `eds-mobile/packages/tokens/spec/motion/ios-native.json` |
| RN Presets | `eds-mobile/packages/mobile-animations/src/index.ts` |
| EDS 规范 | `eds-mobile/.cursor/rules/work.mdc` |
| Figma catalog | `eds-mobile/packages/components/src/catalog/figmaCatalog.ts` |

## 附录 3 — 项目文档索引

| 文档 | 说明 |
|------|------|
| 本文档 | 项目说明 + Motion 使用边界 |
| `React Native 跨平台与双端开发预览方案.md` | 双预览架构原文（用户提供） |

## 附录 4 — 变更记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-09-15 | 初版：明确 Motion 归 DS；项目侧完整共识 + 使用指南 |
