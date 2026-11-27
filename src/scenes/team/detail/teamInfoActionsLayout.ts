import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 团队信息底栏水平边距 · `spacing-5`（20px · 相对屏缘）。 */
export function teamInfoActionsEdgeInset(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-5']);
}

/** 尾分 `EgDividerEnd` 左右距屏 · `spacing-5`（20px）。 */
export function teamInfoDividerScreenInset(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-5']);
}

/** 列表底留白 · 单 `lg` 按钮 + 底边（`max(safeArea, spacing-5)`）。 */
export function teamInfoActionsChromeReserve(
  spacing: typeof mobileTheme.spacing,
  safeAreaBottom: number,
): number {
  const buttonH = edsPx(spacing['button-lg']);
  const restEdge = edsPx(spacing['spacing-5']);
  const bottomPad = Math.max(safeAreaBottom, restEdge);
  return buttonH + bottomPad;
}