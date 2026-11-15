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
- 在无关任务（修 bug、接接口等）中顺手「按 design.md 整页改版」。

要点速览见 `docs/design.md`；与 `work.md` §5.0 一致。列表、设置行、分段 Tab 的视觉与度量以 **eds-mobile Showcase / 当前 dist** 为准，本仓 **不复述** DS 组件专章。