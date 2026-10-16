# EDS Mobile 预览架构（work-cregis-mobile 视角）

> **版本**：2026-10-14  
> **术语**：**EDS** / **EDS Mobile**（不用 DS）

---

## 1. 开发端口（固定）

| 项目 | 场景 | 端口 |
|------|------|------|
| **eds-mobile** `apps/showcase` | 真机 / 模拟器 Metro | **8080** |
| **work-cregis-mobile** | 真机 / 模拟器 Metro | **8081** |

**本仓库不提供浏览器预览**（无 `:8082` / `npm run web` / GitHub Pages 业务壳）。

---

## 2. 架构决策

| 预览入口 | 状态 | 用途 |
|----------|------|------|
| **work-cregis-mobile `:8081`（Native）** | **保留** | Cregis 真机 / 模拟器 / Dev Client |
| **eds-mobile `apps/showcase` `:8080`** | **EDS 唯一组件 preview** | Live · Customize · Props/API · Inspect（模拟器/真机） |

```text
EDS 组件     → pnpm dev:showcase（eds-mobile · Metro :8080）
Consumer 业务 → npm start（Native :8081）
```

---

## 3. 分工

| 验什么 | 入口 |
|--------|------|
| Eg* + Customize + Props | `pnpm dev:showcase` → Metro **8080** |
| 五 Tab Scene / 业务流 | `npm start` → Metro **8081** |

---

## 4. 命令

| 任务 | 命令 |
|------|------|
| 业务 / 集成（真机·模拟器） | `npm start` → Metro **8081** |
| EDS 组件 | `pnpm dev:showcase`（eds-mobile · Metro **8080**） |
