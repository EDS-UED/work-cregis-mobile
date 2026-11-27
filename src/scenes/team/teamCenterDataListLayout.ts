import type { ViewStyle } from 'react-native';

import {
  dataListRowShellInset,
  getDataListRowLayout,
  type DataListRowLayout,
} from '@/scenes/shared/dataListLayout';
import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 行壳距屏 · 与全站 `dataListRowShellInset` 一致 · `spacing-2`（8px）。 */
export function teamCenterListEdgeFromScreen(
  spacing: typeof mobileTheme.spacing,
): number {
  return dataListRowShellInset(spacing);
}

/** 团队中心 DL · 行首圆标 ↔ 文案 `spacing-3`（12px）。 */
export function teamCenterDataListMediaGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 团队中心菜单 / 子页 DataList · 行间 · `spacing-1`（4px）。 */
export function teamCenterDataListRowGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 同组菜单行纵向间距 · 与 {@link teamCenterDataListRowGap} 一致。 */
export function teamCenterDataListGroupStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  return { gap: teamCenterDataListRowGap(spacing) };
}

/**
 * 分块 `EgDivider` · 左右距屏 · `spacing-5`（20px）。
 * 须放在 {@link EgDataList}（DL-bleed）子树内，水平 padding 相对屏缘计量。
 */
export function teamCenterBlockDividerInsetH(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-5']);
}

/** 分块分割线 · 上下留白 · `spacing-3`（12px）。 */
export function teamCenterBlockDividerInsetV(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 成员管理 · 分组间距 · 与通知分类内页一致 · `spacing-7`（28px）。 */
export function teamMemberSectionGroupGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-7']);
}

/** TeamCenter · 行布局与全站 DL 一致（屏缘 8px · 媒体间距见上）。 */
export function getTeamCenterDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  const base = getDataListRowLayout(spacing);
  return {
    ...base,
    titleSubGap: edsPx(spacing['spacing-05']),
  };
}

