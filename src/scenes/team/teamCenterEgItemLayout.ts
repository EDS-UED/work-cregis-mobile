import type { ViewStyle } from 'react-native';

import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 团队账户卡 · 行左右内边距（对齐个人中心账户 `spacing-4` / 16px）。 */
export const TEAM_CENTER_ACCOUNT_ROW_PAD_H = 'spacing-4' as const;

/** 团队信息上卡 · 内容右边距 `spacing-4`（16px）。 */
export const TEAM_CENTER_ACCOUNT_ROW_PAD_RIGHT = TEAM_CENTER_ACCOUNT_ROW_PAD_H;

/** 团队信息上卡 · 内容左 / 上下边距 `spacing-5`（20px）。 */
export const TEAM_CENTER_TEAM_ACCOUNT_PAD_LEFT = 'spacing-5' as const;
export const TEAM_CENTER_TEAM_ACCOUNT_PAD_V = 'spacing-5' as const;

/** 团队账户行 · 头像 ↔ 名称/ID · `spacing-3`（12px）。 */
export const TEAM_CENTER_ACCOUNT_AVATAR_TEXT_GAP = 'spacing-3' as const;

/** 套餐底行等 · `spacing-3`（12px）— 非账户卡主行。 */
export const TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD = 'spacing-3' as const;

/** 团队管理列表行 · 相对分组卡左右 `spacing-2`（8px，与屏缘对齐）。 */
export const TEAM_CENTER_EG_ITEM_LIST_ROW_PAD = 'spacing-2' as const;

/** 团队中心 · 左 icon–主文案间距 `spacing-2`（8px）。 */
export const TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP = 'spacing-2' as const;

/** 团队管理网格卡 · 内容左右内边距 `spacing-3`（12px）。 */
export const TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_H = 'spacing-3' as const;

/** 团队管理网格 · 灰底卡片间距 `spacing-4`（16px）。 */
export const TEAM_CENTER_MANAGEMENT_GRID_OUTER_GAP = 'spacing-4' as const;

/** 团队管理网格卡 · 内容上下内边距 `spacing-6`（24px）。 */
export const TEAM_CENTER_MANAGEMENT_GRID_CELL_PAD_V = 'spacing-6' as const;

/** 团队管理灰底卡圆角 · `radius-sm`。 */
export const TEAM_CENTER_MANAGEMENT_GRID_CARD_RADIUS = 'radius-sm' as const;

/** 团队管理网格 · icon 与文案间距 `spacing-3`（12px）。 */
export const TEAM_CENTER_MANAGEMENT_GRID_ICON_LABEL_GAP = 'spacing-3' as const;

/** 团队管理网格 icon · `symbol-md`（22px）→ `EgSymbol` `size="md"`。 */
export const TEAM_CENTER_MANAGEMENT_GRID_ICON_SYMBOL = 'symbol-md' as const;
export const TEAM_CENTER_MANAGEMENT_GRID_EG_ICON_SIZE = 'md' as const;

/** 团队管理灰底卡点按 · `EgDataListRowPressable` `pressIntensity`（`md` · 滑动不触发）。 */
export const TEAM_CENTER_MANAGEMENT_GRID_PRESS_INTENSITY = 'md' as const;

/** 「团队管理」标题与卡片组间距 `spacing-3`（12px）。 */
export const TEAM_CENTER_MANAGEMENT_TITLE_GRID_GAP = 'spacing-3' as const;

/** 「团队管理」标题距屏左缘 `spacing-5`（20px · 与 Scene 内容边距一致）。 */
export const TEAM_CENTER_MANAGEMENT_TITLE_SCREEN_INSET = 'spacing-5' as const;

/** 团队账户卡与「团队管理」标题间距 `spacing-9`（36px）。 */
export const TEAM_CENTER_ACCOUNT_TO_MANAGEMENT_GAP = 'spacing-9' as const;

/** 团队账户 · 上下叠卡接缝（0px）。 */
export const TEAM_CENTER_ACCOUNT_SPLIT_GAP = 0 as const;

/** 版本账户下卡 · 内容边距：左 `spacing-5`（20）/ 上下 `spacing-4`（16）/ 右 `spacing-4`（16）。 */
export const TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_LEFT = 'spacing-5' as const;
export const TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_V = 'spacing-4' as const;
export const TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_RIGHT = 'spacing-4' as const;

/**
 * 团队 / 版本账户卡 · `EgDataListRowPressable` 强度（含 130ms 按下延迟 · 滑动取消点按）。
 * 内容区 `pressBody` 缩放 · 壳层 / 边距不参与。
 */
export const TEAM_CENTER_ACCOUNT_CARD_PRESS_INTENSITY = 'xs' as const;

/** 团队信息卡（上）· 仅顶角 `radius-lg`。 */
export function teamCenterAccountTeamCardShellStyle(
  spacing: Spacing,
  backgroundColor: string,
): ViewStyle {
  const radius = edsPx(spacing['radius-lg']);
  return {
    backgroundColor,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  };
}

/** 版本信息卡（下）· 仅底角 `radius-lg` · 底与套餐卡一致 `material-card-moderate`。 */
export function teamCenterAccountPlanTierCardShellStyle(
  spacing: Spacing,
  backgroundColor: string,
): ViewStyle {
  const radius = edsPx(spacing['radius-lg']);
  return {
    backgroundColor,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
    overflow: 'hidden',
    position: 'relative',
  };
}

type Spacing = typeof mobileTheme.spacing;

/** `EgItem` 行 `style` · 业务水平内边距 token。 */
export function teamCenterEgItemRowStyle(
  spacing: Spacing,
  padToken:
    | typeof TEAM_CENTER_ACCOUNT_ROW_PAD_H
    | typeof TEAM_CENTER_EG_ITEM_PLAN_ROW_PAD
    | typeof TEAM_CENTER_EG_ITEM_LIST_ROW_PAD,
): ViewStyle {
  return {
    paddingHorizontal: edsPx(spacing[padToken]),
  };
}

/**
 * 包在 `EgItem` `icon` 外 · 把 icon–label 间距从 DS 默认收到 `TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP`。
 * 不改 EDS 源码，仅负 margin 补偿（无 lead 文案簇时用）。
 */
export function teamCenterEgItemIconGapStyle(spacing: Spacing): ViewStyle {
  const dsGap = edsPx(spacing['spacing-4']);
  const targetGap = edsPx(spacing[TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP]);
  const delta = targetGap - dsGap;
  return delta === 0 ? {} : { marginRight: delta };
}