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

---

## 0. 速查

| # | 场景 | Figma / CSS 语义 | RN 默认 |
|---|------|------------------|---------|
| 1 | 段落标题、分段标题 | `typography-title` · `text-base-primary` | `SceneText variant="title"` |
| 2 | 正文 | `typography-body-medium` · `text-base-primary` | `SceneText variant="body"` 或 `bodyMedium`（**weight-regular 400**） |
| 3 | 副文本 | `typography-body-small` · `text-base-secondary` | `SceneText variant="bodySmallSecondary"` |
| 4 | Item 主文案（非 DL 列表行标题等） | `typography-body-medium-strong` · `text-base-primary` | `SceneText variant="bodyMediumStrong"` |
| 4b | **Data list 主文案（DL-title）** | `typography-body-medium-heavy` · `text-base-primary` | `SceneText variant="bodySemibold"` · §3 |
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
- **更重**：`typography-body-medium-heavy`（600）→ `bodySemibold`
- **Data list 行主文案（DL-title）**：**【必须】** `typography-body-medium-heavy`（600）→ `bodySemibold`（§3.3）

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

- **Item 标题 ↔ 副文本**：默认 `--spacing-05`（2px）；**Data list 双行**见 §3.3 **DL-titleSub**。
- **左侧媒体 ↔ 右侧文本**（头像 / 币种图 / icon）：`--spacing-3`（行方向 `gap`）。

---

## 3. Data list（DL · 可点列表行）

**定义**：Scene 内多条可点数据行（首页待办、团队中心设置列表等）共用同一套**边距、圆角、点按态、缩放动效**。实现：**`DataListRow`** + **`getDataListRowLayout`**（`src/scenes/shared/`）。

### 3.1 缩写

| 缩写 | Token / 行为 | RN |
|------|----------------|-----|
| **DL-padH** | 行内左右 | `spacing-3`（**12px**） |
| **DL-padV** | 行内上下 | `spacing-3`（**12px**） |
| **DL-bleed** | 列表容器 `marginHorizontal: −spacing-5` | `dataListSectionStyle()` |
| **DL-marginH** | **行壳**（点按底）距屏幕左右 | `spacing-2`（**8px**）· `dataListRowShellInset()` |
| **DL-gap** | 行内槽位 / **行与行** | `spacing-1`（**4px**）· `contentGap` · `dataListRowGap()` |
| **DL-screen** | **主文案**距屏幕左右 | `marginH + padH`（默认 **20px**）· `dataListScreenInset()` |
| **DL-radius** | `radius-md`（**20px** · `scale-5`；与 Showcase `list row` / shallow card 一致） | `radius` |
| **DL-bg** | 常态 `material-hide` · 按下 `event-tap` | `DataListRow` |
| **DL-press** | semantic press · 档位 **xs** | `useEdsTapPressMotion('xs')` · `DL_PRESS_INTENSITY` |
| **DL-slack** | scale 留白 | **0**（行间由 `dataListRowGap` 控制，不叠 `dlPressScaleSlack`） |
| **DL-title** | 主文案 · `typography-body-medium-heavy`（600）· **100%** | `SceneText variant="bodySemibold"` · `text-base-primary` |
| **DL-sub** | 副文案 · `typography-body-small` · **60%** | `SceneText variant="bodySmallSecondary"` · `text-base-secondary` |
| **DL-titleSub** | 主 ↔ 副纵向间距 | `spacing-05`（**2px**）· `getDataListRowLayout().titleSubGap` |

父级须有 **`Scene` 水平 `spacing-5`**；列表 **DL-bleed** 后再包 **`DataListRow`**。**行壳**距屏左右 **`spacing-2`（8px）**（`marginH`）；行内 `padH`/`padV` **`spacing-3`（12px）**；行与行 **`spacing-1`（4px）**。勿在已 padding 的容器内再挂行壳（会叠边距）。

### 3.2 用法

```tsx
import { DataListRow } from '@/scenes/shared/DataListRow';

// 双行 + 尾标（团队中心）
<DataListRow axis="row" gap={layout.contentGap} onPress={...} accessibilityLabel="…">
  …
</DataListRow>

// 多段纵向（首页待办）
<DataListRow axis="column" gap={…} onPress={…} accessibilityLabel="…">
  …
</DataListRow>
```

**分割線**（可选）：`EgDivider` 左右 `paddingHorizontal` 取 `layout.contentInsetFromScreen`（= **DL-screen**）与主文案对齐。

### 3.3 双行文案（DL-title / DL-sub）

Data list 行内「主 + 副」双行（如团队中心设置项）默认：

| 层级 | 字阶（Figma / CSS） | 颜色变量 | RN |
|------|---------------------|----------|-----|
| **主文本** | `typography-body-medium-heavy`（17 · **600**） | `var(--text-base-primary)` **100%** | `bodySemibold` |
| **副文本** | `typography-body-small` | `var(--text-base-secondary)` **60%**（spec α） | `bodySmallSecondary` |

- 主副纵向间距：**`DL-titleSub`** · `--spacing-05`（**2px**）；实现 `gap: layout.titleSubGap`。
- 首页待办、协作待办、通知交易等**金额 + 币种**主行亦用 **`bodySemibold`**（与 DL-title 一致）；副行/说明仍用 `bodySmallSecondary` 等。

**禁止**在单页另写一套 row margin / `event-tap` / 手写 scale；与 DL 不一致时须有稿面依据。

### 3.4 通用规则 vs 单页调整

**`docs/design.md` §3 与 `getDataListRowLayout()` 定义的是全站默认的通用 Data list 规则**（新页、无稿面例外时遵守）。

| 场景 | 做法 |
|------|------|
| 新列表 / 按默认 DL 实现 | 用 `DataListRow` + `getDataListRowLayout()` · 勿改共享常量 |
| **某一页**稿面要求不同边距/间距/gap | 仅在该 Scene **局部**覆盖（例如本行 `paddingHorizontal`、本页 wrapper `marginHorizontal`）；**禁止**为迁就单页去改 `dataListLayout.ts` 默认值或 §3 缩写表（除非产品确认要升级全站默认） |
| 单页例外落地后 | 在该页文件顶注释或 PR 写一句「DL 例外：…」；**不要**把例外反写进 §3 冒充通用规则 |

Agent **不得**因单页改版而批量把其它页的 DL 改成同一例外，除非用户明确准许。

**已登记单页例外（媒体间距 / 行内水平）**

| 场景 | 行首媒体 ↔ 文案 | 行内左右 `padH` | 实现 |
|------|------------------|-----------------|------|
| **团队中心** 设置列表 | `spacing-3`（**12px**） | 全站 DL · 行壳距屏 8px | `teamCenterDataListMediaGap` · `TeamCenterMenuRow` |
| **团队切换** EgSheets | `spacing-3`（**12px**） | 全站 DL · `spacing-3`（12px） | `teamSwitcherDataListMediaGap` |

---

## 4. 尺寸

| 类型 | 默认 token | 实现 |
|------|------------|------|
| 头像、币种图等 | `avatar-lg` | `EgAvatar size="lg"`；宽高亦可用 `edsPx(spacing['avatar-lg'])` |
| Icon | `symbol-md` | EgIcon `size="md"` · `EgSymbol size="md"`；或将 `displayPx={edsPx(spacing['symbol-md'])}` |

未单独标注的大图/小图再在稿面级覆盖，并优先用 spacing 族 token（`avatar-*` · `symbol-*`），不用裸数字。

---

## 5. 与代码库对照

| 主题 | 位置 |
|------|------|
| 字阶 variant 定义 | `src/utils/edsTheme.ts` · `SceneText` |
| 页水平边距 / Nav 间距常量 | `EDS_SCENE_CONTENT_INSET` · `EDS_NAV_CONTENT_GAP` |
| **Data list** | `src/scenes/shared/DataListRow.tsx` · `dataListLayout.ts` |
| 页面壳 | `src/scenes/shared/SceneScaffold.tsx` |
| 集成总规范 | `.cursor/rules/work.md` §5.0 · §5.1 |

---

## 6. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-11-12 | 初版：文字 1–4、间距 5–7、尺寸 8 |
| 2026-11-12 | 明确：仅新页/获准场景参考；禁止未经许可按本规范替换已有页布局样式 |
| 2026-11-12 | §3 Data list（DL）：与首页待办对齐之 `DataListRow` |
| 2026-11-12 | §3.3 DL-title / DL-sub 字阶与 100% / 60% 色 |
| 2026-11-12 | DL-titleSub · spacing-1（4px） |
| 2026-11-12 | DL-titleSub · spacing-05（2px） |
| 2026-11-12 | DL padH 16 / padV 12 · marginH & gap 4（spacing-1） |
| 2026-11-12 | DL padH · spacing-3（12px）· DL-screen 16px |
| 2026-11-13 | 全站 DL：`marginH` 0 · `DL-screen` **12px**（`padH`/`padV` `spacing-3`） |
| 2026-11-13 | 全站 DL：**行壳**距屏 **8px**（`marginH` `spacing-2`）· 行间距 **4px** · 文案距屏 20px（`padH` 12） |
| 2026-11-12 | §3.4 团队中心 / 团队切换 DL 媒体 12px · 切换行内左右 16px |
| 2026-11-12 | §3.4 通用 DL vs 单页例外（不改共享默认） |
| 2026-11-13 | **DL-title** 全站 · `typography-body-medium-heavy`（600）→ `bodySemibold` |

_（以下随产品补充条目，保持 §0 速查表同步更新。）_
