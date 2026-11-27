import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 底栏水平边距 · `spacing-7`。 */
export function teamAmlActionsEdgeInset(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-7']);
}

/** 列表底留白 · 双 `lg` 按钮 + 8px 间距 + 底边（`max(safeArea, spacing-5)`）。 */
export function teamAmlActionsChromeReserve(
  spacing: typeof mobileTheme.spacing,
  safeAreaBottom: number,
): number {
  const buttonH = edsPx(spacing['button-lg']);
  const gap = edsPx(spacing['spacing-2']);
  const restEdge = edsPx(spacing['spacing-5']);
  const bottomPad = Math.max(safeAreaBottom, restEdge);
  return buttonH * 2 + gap + bottomPad;
}