import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  EG_ITEM_LEADING_ICON_STROKE,
  EG_ITEM_LEAD_ICON_EG_SYMBOL_SIZE,
  egItemLeadIconSlotPx,
} from '@/scenes/shared/egItemLeadIconMetrics';

type EgItemLeadIconProps = {
  name: string;
};

/**
 * `EgItem` 左图 · 槽 `symbol-md` · 描边 {@link EG_ITEM_LEADING_ICON_STROKE}（Showcase 同源）。
 */
export function EgItemLeadIcon({ name }: EgItemLeadIconProps) {
  const { mode, spacing } = useEdsTheme();
  const slotPx = egItemLeadIconSlotPx(spacing);

  return (
    <EgSymbol
      name={name}
      mode={mode}
      size={EG_ITEM_LEAD_ICON_EG_SYMBOL_SIZE}
      displayPx={slotPx}
      strokeScaleToken={EG_ITEM_LEADING_ICON_STROKE}
      fillTone="primary"
      accessibilityLabel=""
    />
  );
}