import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 币种标题行 · 列表编辑钮距屏右 · `spacing-3`（12px）。 */
export function walletListEditorScreenInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 「币种」标题 ↔ `EgDataList` · `spacing-2`（8px）。 */
export function walletCurrencyTitleToListGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2']);
}