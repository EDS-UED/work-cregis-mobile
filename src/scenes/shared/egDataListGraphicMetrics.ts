import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 与 Showcase `DataListGraphicSize` / `dataListGraphicSpacingToken` 同源。 */
export type EgDataListGraphicSize = 'sm' | 'md' | 'lg' | 'xl';

const GRAPHIC_SLOT_SPACING_KEY: Record<
  EgDataListGraphicSize,
  'avatar-lg' | 'avatar-xl' | 'avatar-3xl' | 'avatar-4xl'
> = {
  sm: 'avatar-lg',
  md: 'avatar-xl',
  lg: 'avatar-3xl',
  xl: 'avatar-4xl',
};

/** EgDataList 图形插槽边长 · `md` → `avatar-xl`（40px）。 */
export function egDataListGraphicSlotPx(
  spacing: typeof mobileTheme.spacing,
  size: EgDataListGraphicSize = 'md',
): number {
  return edsPx(spacing[GRAPHIC_SLOT_SPACING_KEY[size]]);
}

/** 图形 `icon` 类型 · 槽内 `EgSymbol` 默认字阶 · `md` → `symbol-md`（22px）。 */
export function egDataListGraphicIconSymbolPx(
  spacing: typeof mobileTheme.spacing,
  size: EgDataListGraphicSize = 'md',
): number {
  if (size === 'sm') return edsPx(spacing['symbol-sm']);
  if (size === 'lg' || size === 'xl') return edsPx(spacing['symbol-lg']);
  return edsPx(spacing['symbol-md']);
}