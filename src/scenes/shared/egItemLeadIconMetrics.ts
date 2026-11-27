import { EG_ITEM_ICON_SLOT, EG_ITEM_LEADING_ICON_STROKE } from '@/eds/item';
import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 与 DS `EG_ITEM_ICON_SLOT` 同源 · `symbol-md`（22px）。 */
export const EG_ITEM_LEAD_ICON_SPACING_KEY = 'symbol-md' as const;

/** `EgItem` 左槽宽 · 与行内 `iconSlot.width` 一致。 */
export function egItemLeadIconSlotPx(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing[EG_ITEM_LEAD_ICON_SPACING_KEY]);
}

/** Showcase：`EgSymbol size="md"` 等价 `displayPx`。 */
export const EG_ITEM_LEAD_ICON_EG_SYMBOL_SIZE = 'md' as const;

/** 与 DS `EgItem` 左图规范同源 · `stroke-lg`（`--stroke-lg`）。 */
export { EG_ITEM_ICON_SLOT, EG_ITEM_LEADING_ICON_STROKE };