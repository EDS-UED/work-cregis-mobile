import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 币种行尾列表编辑 · 距屏右 · `spacing-2`（8px）。 */
export function walletListEditorScreenInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2']);
}

/** 「币种」标题 ↔ `EgDataList` · `spacing-2`（8px）。 */
export function walletCurrencyTitleToListGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2']);
}