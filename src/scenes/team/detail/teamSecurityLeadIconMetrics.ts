import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 团队安全 DL 行首圆槽 · `capsule-md`（48px）。 */
export function teamSecurityLeadSlotPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['capsule-md']);
}

/** 团队安全行首线框图标 · `symbol-sm`（20px）。 */
export function teamSecurityLeadSymbolPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['symbol-sm']);
}