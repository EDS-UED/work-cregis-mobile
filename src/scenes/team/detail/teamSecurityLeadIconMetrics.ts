import type mobileTheme from '@/eds/tokens';
import { egDataListGraphicSlotPx } from '@/scenes/shared/egDataListGraphicMetrics';
import { edsPx } from '@/utils/edsTheme';

const TEAM_SECURITY_GRAPHIC_SIZE = 'md' as const;

/** 团队安全 DL 行首 · EgDataList 图形 `md`（`avatar-xl` · 40px）。 */
export function teamSecurityLeadSlotPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return egDataListGraphicSlotPx(spacing, TEAM_SECURITY_GRAPHIC_SIZE);
}

/** 团队安全行首槽内线框图标 · `symbol-sm`（20px）。 */
export function teamSecurityLeadSymbolPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['symbol-sm']);
}