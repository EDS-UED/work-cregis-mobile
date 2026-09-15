# work-cregis-mobile

Cregis 跨平台 Mobile 业务应用，基于 [EDS Mobile](https://github.com/EDS-UED/eds-mobile) 设计系统构建。

| | |
|---|---|
| **GitHub** | [EDS-UED/work-cregis-mobile](https://github.com/EDS-UED/work-cregis-mobile) |
| **Live Preview (Pages)** | https://eds-ued.github.io/work-cregis-mobile/ |
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
npm run web
```

- 本地 Browser Preview：http://localhost:8090/
- Pages 线上预览见下方 §GitHub Pages

详细架构与 Motion 边界见 [`docs/cregis-mobile-project-brief.md`](docs/cregis-mobile-project-brief.md)。

## 设计系统集成（Mobile only）

| 资产 | 包 | 说明 |
|------|-----|------|
| Tokens | `@eds/mobile-tokens` | 颜色 / 间距 / 排版；`getThemeColors(mode)` |
| Animations | `@eds/mobile-animations` | iOS-native motion preset（Reanimated） |
| Components | `@eds/mobile-components` | 202 个 `Eg*` 组件 |
| 统一出口 | `@eds-evergreen/mobile` | consumer 主要 import 入口 |

**100% EDS Mobile** — 禁止 consumer 自建 design / motion token；缺失须与设计系统确认。

本地依赖：`package.json` 中 `"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"`。

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run web` | Browser Preview（`:8090`） |
| `npm start` | Expo Dev Server（Native / Web） |
| `npm run ios` | iOS Simulator |
| `npm run android` | Android Emulator |
| `npm run ios:device` | 真机 Development Build（iOS，首次编译 Native） |
| `npm run android:device` | 真机 Development Build（Android） |
| `npm run typecheck` | TypeScript 检查 |
| `npm run build:pages` | 构建 GitHub Pages 静态产物（`dist/`） |
| `npm run preview:pages` | 本地模拟 Pages 构建并静态服务 |

## Browser Preview

- **Preview**：正常交互
- **Inspect**：点选业务卡片，右侧查看 Layout / Styles / Motion（Motion 语义来自 EDS）
- 设备预设：iPhone / Pro / Pro Max / Android / Small Android

## 五 Tab 占位

主页 · 协作 · 资产 · WaaS项目 · 我的

## 项目结构

```text
src/scenes/          业务场景
src/navigation/      React Navigation（Tab + Native Stack）
src/store/           Zustand
src/services/        Mock / Native adapters（Biometrics · SecureStorage）
browser-preview/     设备框壳层
dev-mode/            Inspect 面板
docs/                项目说明文档
```

## GitHub Pages 部署

仓库已配置 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)：`main` 分支 push 后自动构建并发布。

**前置：** CI 同目录检出 [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile)（workflow 内按 SHA pin 为 sibling `eds-mobile`）。

**预览地址（push 成功后）：** https://eds-ued.github.io/work-cregis-mobile/

本地模拟 Pages 构建：

```bash
EXPO_BASE_URL=/work-cregis-mobile npm run build:pages
npx serve dist -p 8091
```

打开 http://localhost:8091/work-cregis-mobile/

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) | Mobile 设计系统 |
| [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop) | Desktop 设计系统 |
| [EDS-UED/work-cregis-desktop](https://github.com/EDS-UED/work-cregis-desktop) | Cregis Desktop 业务应用（独立架构） |
