# EAS Update + Expo Go 远程预览

目标：**你电脑关闭、同事不同网**，仍可通过 **Expo Go** 打开 **EAS Dashboard → Preview 二维码** 查看 `work-cregis-mobile` 最新 JS；**不要求**同事安装 Cregis 自定义 APK/IPA。

## 架构

```text
push → EAS Workflow (eas update) → Expo CDN
同事：Expo Go → expo.dev Updates 页 → Preview 二维码
```

- **容器**：官方 **Expo Go**（需与 **SDK 57** 匹配）。
- **设计系统**：EAS 云端通过 `eas-build-pre-install` clone `EDS-UED/eds-mobile` 并 `pnpm build:mobile`（见 `scripts/eas-preinstall-eds.mjs`）。

## 一次性 setup（维护者）

### 1. EAS 项目（已创建）

- **Dashboard**：https://expo.dev/accounts/theyangsongs-team/projects/eds-ued  
- **Project ID**：已写入 `app.config.ts`（`6ac19714-fbe5-4de6-ab92-ea1bb47a0ff5`）

本机发 update 无需再 `eas init`。CLI 用法：

```bash
cd /Users/DanBaby/Projects/work-cregis-mobile
npx eas-cli login    # 已登录 theyangsong 可跳过
npm run preview:update
```

`app.config.ts` 已启用 `updates.url` 与 `runtimeVersion.policy: sdkVersion`（对齐 Expo Go）。

### 2. GitHub 连接 EAS Workflows

1. [expo.dev](https://expo.dev) → 本项目 → **GitHub** → 连接 `EDS-UED/work-cregis-mobile`。
2. 启用 **EAS Workflows**（仓库内已含 `.eas/workflows/publish-preview-update.yml`）。

### 3. Secrets（eds-mobile 为 private 时）

| 变量 | 用途 |
|------|------|
| `GITHUB_PAT` | clone `EDS-UED/eds-mobile`（Fine-grained PAT · repo read） |
| `EAS_PROJECT_ID` | 构建/发布时写入 `app.config` 所需 project id（若 Workflow 未自动注入） |

可选：`EDS_MOBILE_GIT_REF`（默认 `main`）钉住设计系统分支/tag。

## 发布 update

### 自动（推荐）

向已连接 Workflow 的分支 **push** → EAS 执行 `publish-preview-update` → channel **`preview`**。

### 手动

```bash
export EAS_PROJECT_ID=<uuid>   # 若未在 Dashboard 配置
node scripts/ensure-eds-mobile.mjs
npm run preview:update
# 等价于 eas update --channel preview --auto
```

终端或 Dashboard 会给出 **Updates** 链接。

## 同事怎么用

1. 安装 **Expo Go**（App Store / Google Play）。
2. 打开维护者发的 **expo.dev → Project → Updates → 最新一条 → Preview**。
3. 扫 **Preview 二维码**（或按页内说明在 Expo Go 中打开）。

无需与你同网；无需安装 Cregis 安装包。

## 限制

- 若项目出现 Expo Go **不支持的原生能力**，Preview 会失败；在「不装自定义包」前提下只能减依赖或改 Expo Go 兼容方案。
- 仅改 JS/TS 一般只需 `eas update`；升级 Expo SDK / 改 `plugins` 等需确认与 **Expo Go 版本**一致。

## 本地开发（不变）

同级 `../eds-mobile` + `file:../eds-mobile/packages/mobile` + `ensure-eds-mobile.mjs`；**不要**为日常开发改 npm registry 依赖。
