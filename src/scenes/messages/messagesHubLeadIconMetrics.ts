import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 通知前置页（Hub）行首圆槽 · `capsule-md`（48px）。 */
export function messagesHubLeadSlotPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['capsule-md']);
}

/** 通知前置页（Hub）行首线框图标 · `symbol-sm`（20px）。 */
export function messagesHubLeadSymbolPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['symbol-sm']);
}
