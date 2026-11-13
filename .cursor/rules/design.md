---
description: 新页视觉参考（非强制改造既有 Scene）— 见 docs/design.md
globs: src/scenes/**
alwaysApply: false
---

# 业务页视觉默认（参考）

[`docs/design.md`](../../docs/design.md) 是 Agent **设计或从零生成新页面**时的**参考默认**，不是全站强制规范。

**【必须】**

- **新页 / 用户明确说按 design 对齐**：优先采用 `docs/design.md` §0 的字、距、尺寸。
- **已有 `src/scenes/**`**：保持现有布局与样式，除非用户或稿面**单独准许**改动。

**【禁止】**

- 未经用户准许，以 `design.md` 为由替换、统一、重构已有页面的布局、间距、字阶或组件选型。
- **Data list**：§3 / `getDataListRowLayout()` 为**通用默认**；单页 DL 例外只改该 Scene 局部，**禁止**为单页改动 `dataListLayout.ts` 默认值或 §3 缩写（除非用户确认升级全站默认）。
- 在无关任务（修 bug、接接口等）中顺手「按 design.md 整页改版」。

要点速览见 `docs/design.md`；与 `work.md` §5.0 一致。**DL**：**行壳**距屏 **8px**（`marginH`）· 行间 **4px**；**DL-title** · `typography-body-medium-heavy`（600）→ `bodySemibold`；**DL-sub** 见 §3.3。
