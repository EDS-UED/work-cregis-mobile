import type { ViewStyle } from 'react-native';

import { EG_SEARCH_FIELD_HEIGHT } from '@/eds/search';
import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 静止态 · dock 距屏左/右/下 · Showcase 同源 `spacing-5`。 */
export function teamMemberSearchDockRestEdgeInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-5']);
}

/** 聚焦 / 键盘 · dock 水平边距 · Showcase 同源 `spacing-3`。 */
export function teamMemberSearchDockFocusedEdgeInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/**
 * Showcase `ShowcaseSearchDemoView.styles.searchChromeReset` —
 * 屏缘由 dock `padding` 承担，勿覆写 `EgSearch` 默认左/下/右边距 token。
 */
export function teamMemberSearchEgSearchChromeStyle(): ViewStyle {
  return {
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
  };
}

/** 列表底留白 · 条高 + `max(safeArea, spacing-5)`。 */
export function teamMemberSearchChromeReserve(
  spacing: typeof mobileTheme.spacing,
  safeAreaBottom: number,
): number {
  const restEdge = teamMemberSearchDockRestEdgeInset(spacing);
  return EG_SEARCH_FIELD_HEIGHT + Math.max(safeAreaBottom, restEdge);
}