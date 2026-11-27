import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** `EgDividerEnd` · 中线点直径 · `spacing-1`（4px）。 */
export function egDividerEndDotSize(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-1']);
}

/** `EgDividerEnd` · 左右线与中线点间距 · `spacing-2`（8px）。 */
export function egDividerEndGap(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-2']);
}