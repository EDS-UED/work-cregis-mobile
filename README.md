# work-cregis-mobile

Cregis 跨平台 Mobile 业务应用，基于 [EDS Mobile](https://github.com/EDS-UED/eds-mobile) 设计系统构建。

| | |
|---|---|
| **GitHub** | [EDS-UED/work-cregis-mobile](https://github.com/EDS-UED/work-cregis-mobile) |
| **设计系统** | [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) |
| **Figma** | [EDS Mobile](https://www.figma.com/design/LlB2jT8KdxM6taf5wOSAEM/) |

## 前置条件

- Node.js 20+
- npm 10+（consumer）
- pnpm 9+（构建 `eds-mobile` 时）
- 同级目录存在 `eds-mobile`：

```text
Projects/
  eds-mobile/           ← 设计系统
  work-cregis-mobile/   ← 本项目
```

## 快速开始

```bash
# 1. 构建设计系统（首次或 token 变更后）
cd ../eds-mobile
pnpm install
pnpm build:mobile

# 2. 安装并启动 consumer
cd ../work-cregis-mobile
npm install
npm start
# 或 npm run ios / npm run android
```

详细架构与 Motion 边界见 [`docs/cregis-mobile-project-brief.md`](docs/cregis-mobile-project-brief.md)。

**远程预览（EAS Update + Expo Go，无需安装包）**：见 [`docs/eas-expo-go-preview.md`](docs/eas-expo-go-preview.md)。

## 设计系统集成（Mobile only）

| 资产 | 包 | 说明 |
|------|-----|------|
| Tokens / Eg* / Motion | `@eds-evergreen/mobile`（唯一 EDS 依赖） | `getThemeColors` · `mobileTheme` · `mobileMotion` · 全量 `dist` |
| Animations | `@eds/mobile-animations` | iOS-native motion preset（Reanimated） |
| Components | `@eds/mobile-components` | 202 个 `Eg*` 组件 |
| 统一出口 | `@eds-evergreen/mobile` | consumer 主要 import 入口 |

**100% EDS Mobile** — 禁止 consumer 自建 design / motion token；缺失须与设计系统确认。

**EDS 依赖（仅本地）**：`"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"` — 联调 sibling 仓库 `eds-mobile`，**不要**从 npm 安装 `@eds-evergreen/mobile`（registry 包是对外发布用）。

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm start` | 真机 / 模拟器 Metro → **8081**（Expo Go 名称 **Cregis UED**） |
| `npm run ios` | iOS Simulator（Metro 8081） |
| `npm run android` | Android Emulator（Metro 8081） |
| `npm run ios:device` | 真机 Development Build（iOS） |
| `npm run android:device` | 真机 Development Build（Android） |
| `npm run typecheck` | TypeScript 检查 |

EDS 组件 preview：`../eds-mobile` · `pnpm dev:showcase`（模拟器/真机 · Metro **8080**）。

## 五 Tab 占位

主页 · 协作 · 资产 · WaaS项目 · 我的

## 项目结构

```text
src/scenes/          业务场景
src/navigation/      React Navigation（Tab + Native Stack）
src/store/           Zustand
src/services/        Native adapters（Biometrics · SecureStorage）
docs/                项目说明文档
```

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) | Mobile 设计系统 |
| [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop) | Desktop 设计系统 |
| [EDS-UED/work-cregis-desktop](https://github.com/EDS-UED/work-cregis-desktop) | Cregis Desktop 业务应用（独立架构） |
