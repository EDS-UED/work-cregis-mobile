# 业务页视觉默认（Design Defaults）

> **状态**：随产品扩展；与 EDS token spec 冲突时以 **EDS / 同步后的 dist** 为准，本文件记录 **Cregis Mobile 业务 Scene 的默认选用**。  
> **受众**：设计对齐、**从零搭建新页**、用户明确要求按此规范实现的场景。  
> **性质**：**参考默认**，非全仓强制执行规范。  
> **实现**：`SceneText` variant · `useEdsTheme().spacing` · `edsPx()` · Eg* 尺寸 prop（见下表）。

### 使用边界（必读）

| ✅ 适用 | ❌ 禁止（未经用户准许） |
|--------|-------------------------|
| 设计/生成**新页面**时作 typography、间距、尺寸的**起点** | 以本文件为由**批量或顺手**改已有 Scene 的布局、样式、字阶 |
| 用户指令「按 design.md / 对齐视觉默认」的改动 | **替换**现有页面上已与稿面或产品验收一致的实现 |
| 新代码块缺省选型（与稿面无冲突时） | 在 bugfix、重构、无关需求里顺带「统一成 design.md」 |

已有页面维持现状，直至用户或稿面**单独提出**调整。稿面 / PRD 与本文件冲突时，以稿面为准。

**列表与设置行**：可点列表、设置项、胶囊分段 Tab 的间距、圆角、点按态由 **`@/eds/data-list`**（`EgDataList` / `EgDataListRow`）、**`@/eds/item`**、**`@/eds/tab-block`** / **`@/eds/tab`** 与 eds-mobile Showcase 定义；本文件**不复述**其规约。

---

## 0. 速查

| # | 场景 | Figma / CSS 语义 | RN 默认 |
|---|------|------------------|---------|
| 1 | 段落标题、分段标题 | `typography-title` · `text-base-primary` | `SceneText variant="title"` |
| 2 | 正文 | `typography-body-medium` · `text-base-primary` | `SceneText variant="body"` 或 `bodyMedium`（**weight-regular 400**） |
| 3 | 副文本 | `typography-body-small` · `text-base-secondary` | `SceneText variant="bodySmallSecondary"` |
| 4 | Item 主文案（设置行标题等） | `typography-body-medium-strong` · `text-base-primary` | `SceneText variant="bodyMediumStrong"` |
| 4b | 更重主文案（待办金额等行内文案） | `typography-body-medium-heavy` · `text-base-primary` | `SceneText variant="bodySemibold"` |
| 5 | Item 与副文本间距 | `--spacing-1` | `edsPx(spacing['spacing-1'])` |
| 5b | Item 左侧有图/头像/icon 时，与右侧文案 | `--spacing-3` | `edsPx(spacing['spacing-3'])` |
| 6 | 页面边距 | 上 `spacing-4` · 左右 `spacing-5` · 下 `spacing-8` | 见 §2 |
| 7 | 段落 / 块 / 卡片之间 | `--spacing-7` | `edsPx(spacing['spacing-7'])` |
| 8 | 头像、币种等 | `avatar-lg` | `EgAvatar size="lg"` 等 |
| 8b | Icon | `--symbol-md` | EgIcon / `EgSymbol` · `size="md"`（或 `displayPx` 取自 `symbol-md`） |

**例外**：稿面或 PRD 显式标注时覆盖本默认；覆盖须在 PR/说明中一句交代依据（不视为对全站既有页的追溯改造）。

---

## 1. 文字

### 1.1 分段标题（段落标题）

- **字阶**：`typography-title`
- **颜色**：`var(--text-base-primary)`
- **实现**：`SceneText variant="title"`（已绑定 primary）

### 1.2 正文

- **字阶**：`typography-body-medium`
- **颜色**：`var(--text-base-primary)`
- **实现**：`SceneText variant="body"` 或 `bodyMedium`（须 `weight-regular`，勿用 500）

### 1.2a 正文 · 60% 主色（仍 body-medium 字阶）

- **字阶**：`typography-body-medium` · **字重 400**
- **颜色**：`var(--text-base-secondary)`（spec α 60%）
- **实现**：`SceneText variant="secondary"`

### 1.3 副文本

- **字阶**：`typography-body-small`
- **颜色**：`var(--text-base-secondary)`
- **实现**：`SceneText variant="bodySmallSecondary"`

### 1.4 Item 主文案

- **字阶**：`typography-body-medium-strong`（17px · **weight-medium 500**）
- **颜色**：`var(--text-base-primary)`
- **实现**：`SceneText variant="bodyMediumStrong"`
- **更重**：`typography-body-medium-heavy`（600）→ `bodySemibold`（行内自定义内容时用，组件壳由 Eg* 负责）

### 1.5 禁止

- 在 Scene 内为「套默认」手写 `fontSize` / `fontWeight` / 灰 hex；缺 variant 时 **先补** `src/utils/edsTheme.ts` 的 `createEdsTypographyStyles`，再使用 `SceneText`。
- 品牌/Decor 等特殊色仅在有稿面或组件 spec 时使用，不替代上述默认层级。

---

## 2. 间距

### 2.1 页面边距（相对屏幕 / 导航）

| 边 | Token | 含义 | 业务约定 |
|----|-------|------|----------|
| **上** | `--spacing-4` | 导航底到首屏内容 | `edsNavContentGap(spacing)` · `EDS_NAV_CONTENT_GAP` |
| **左右** | `--spacing-5` | 距屏幕内容边缘 | `edsSceneContentInset(spacing)` · `EDS_SCENE_CONTENT_INSET` |
| **下** | `--spacing-8` | 内容区到底（含 Tab 安全区策略见 `SceneScaffold`） | `edsPx(spacing['spacing-8'])`；滚动页 `contentContainerStyle.paddingBottom` 至少含此档（叠加 Tab reserve 时在其上增加，不替代） |

新页优先通过 **`SceneScaffold`** 承接上/左右；若 scaffold 尚未统一 bottom `spacing-8`，单页临时对齐该值并记 backlog 收敛到 scaffold。

### 2.2 块间距

- 段落、卡片、独立块之间默认 **`--spacing-7`**（`edsPx(spacing['spacing-7'])`）。
- 可用父级 `gap: edsPx(spacing['spacing-7'])`，避免块内手搓 margin 魔法数。

### 2.3 列表行（Item · 内容间距）

- **标题 ↔ 副文本**：默认 `--spacing-05`（2px）；**双行待办等**行内用 `spacing-05` 或与稿面一致的 `gap`。
- **左侧媒体 ↔ 右侧文本**（头像 / 币种图 / icon）：`--spacing-3`（行方向 `gap`）。

---

## 3. 尺寸

| 类型 | 默认 token | 实现 |
|------|------------|------|
| 头像、币种图等 | `avatar-lg` | `EgAvatar size="lg"`；宽高亦可用 `edsPx(spacing['avatar-lg'])` |
| Icon | `symbol-md` | EgIcon `size="md"` · `EgSymbol size="md"`；或将 `displayPx={edsPx(spacing['symbol-md'])}` |

未单独标注的大图/小图再在稿面级覆盖，并优先用 spacing 族 token（`avatar-*` · `symbol-*`），不用裸数字。

---

## 4. 与代码库对照

| 主题 | 位置 |
|------|------|
| 字阶 variant 定义 | `src/utils/edsTheme.ts` · `SceneText` |
| 页水平边距 / Nav 间距常量 | `EDS_SCENE_CONTENT_INSET` · `EDS_NAV_CONTENT_GAP` |
| DS 列表 / 设置 / Tab | `@/eds/data-list` · `@/eds/item` · `@/eds/tab-block` · `@/eds/tab` |
| 列表 metrics 委托 | `src/scenes/shared/dataListLayout.ts` |
| 页面壳 | `src/scenes/shared/SceneScaffold.tsx` |
| 集成总规范 | `.cursor/rules/work.md` §5.0 · §5.1 · §3.1.1 |

---

## 5. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-11-12 | 初版：文字 1–4、间距 5–7、尺寸 8 |
| 2026-11-12 | 明确：仅新页/获准场景参考；禁止未经许可按本规范替换已有页布局样式 |
| 2026-11-16 | 移除复刻的 Data list（DL）专章；列表/设置/Tab 规约以 EDS Eg* 与 Showcase 为准 |

_（以下随产品补充条目，保持 §0 速查表同步更新。）_