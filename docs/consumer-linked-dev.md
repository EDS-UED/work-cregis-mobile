# EDS Mobile 本地联调（Cregis · 业务侧）

与 **eds-mobile** 为 `file:` 依赖；设计系统改代码后，在 **Metro 开发**里尽快看到效果。下面为 **一次性配置**，之后日常 **只开 Expo** 即可。

排错真源：[../eds-mobile/docs/consumer-linked-dev.md](../eds-mobile/docs/consumer-linked-dev.md)

---

## 1. 依赖（保持现状）

```json
"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"
```

目录关系：`work-cregis-mobile` 与 `eds-mobile` **同级**（如都在 `~/Projects/` 下）。

若 `pnpm install` 后改 EDS 仍不生效：试 **`npm install`** 或 **`CI=true pnpm install`**，避免 `file:` 被拷到 store 里的旧副本。

---

## 2. Metro（必做，只做一次）

从 EDS 复制示例到本项目根目录：

```bash
cp ../eds-mobile/docs/consumer-metro.config.example.cjs metro.config.js
```

若 `eds-mobile` 不在 `../eds-mobile`，改 `metro.config.js` 里的 **`edsMobileRoot`**。

**本仓现状**：`metro.config.js` 已基于上述示例，并合并 Cregis 项（`expo-router/unstable-native-tabs` shim、**iOS `expo-glass-effect` shim**（Home 顶栏 `EgButtonGlass` 原生液态玻璃 · Expo Go）、`@/*` → `src/*`、SDK 58 resolver 兜底、`@eds/mobile-*` workspace 解析）。**无需再覆盖**，除非 EDS 示例大改后人工 merge。

**作用**：`@eds-evergreen/mobile` → EDS **源码**（`linkedMetroEntry.ts`）；组件改动走 **Fast Refresh**；token 由 EDS 侧 watch 触发 **Metro reload**。

改 `metro.config.js` 后须 **重启 Metro `--clear`**。

---

## 3. 日常怎么跑

**业务（本仓 · Expo Go 真机预览）**

```bash
npm start   # 默认：Metro + EDS token watch（assemble dist → reload 已连真机）
```

- **`prestart` → `ensure-eds-mobile.mjs`**：启动前若 spec 比 dist 新会 `build:mobile` 一次。
- **`start`** 会并行 **`../eds-mobile/scripts/watch-linked-consumers`**（`build:tokens` → assemble `@eds-evergreen/mobile` → **Metro reload**）。真机 Expo Go 须与电脑 **同一 Wi‑Fi**，并已打开项目连 **8081**。
- 不要 token 自动推送：`CREGIS_EDS_TOKEN_WATCH=0 npm start` 或 `npm run start:metro-only`。

默认 Metro 走 **assemble dist**（Expo Go 稳定路径）。要联调 EDS **组件源码**：

```bash
CREGIS_EDS_LINKED_METRO=1 npm start
```

| 改了什么 | 真机上怎么更新 |
|----------|----------------|
| `src/**` | Fast Refresh |
| EDS `packages/tokens/spec`（如 `.glass-button-box`） | watch → assemble → **自动 reload**（须 Metro + 真机已连接） |
| EDS 组件源码 | `CREGIS_EDS_LINKED_METRO=1` → Fast Refresh；或 `build:components` + assemble 后 reload |

---

## 4. 纪律（单向）

- ✅ `import { Eg*, mobileTheme } from '@eds-evergreen/mobile'`
- ❌ 不要改 `node_modules/@eds-evergreen/mobile`
- ❌ 不要改 `../eds-mobile` 里的文件
- 业务定制在本仓 **包一层**；要改 EDS 组件请在 **eds-mobile 提 PR**

---

## 5. 测试 / 真机预览（不是 Metro 联调）

```bash
# eds-mobile
pnpm build:mobile

# 本仓
npm run preview:update   # 或现有 EAS 流程
```

---

## 6. 不用联调时

只关本仓 **Expo** 即可。机器卡顿时，确认没有多余终端在跑 EDS 的 `watch:linked-consumers` / `dev:showcase`。
