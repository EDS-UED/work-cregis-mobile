import { useEffect, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colorizeTokenIconMarkup } from '@eds/internal/dist/components/atoms/_shared/icon/colorizeIconMarkup.js';
import { EgAtomSvg } from '@eds/internal/dist/components/atoms/_shared/icon/EgAtomSvg.js';
import { loadIconAsset } from '@eds/internal/dist/components/atoms/_shared/icon/iconAssetLoader.js';
import { sizeIconMarkup } from '@eds/internal/dist/components/atoms/_shared/icon/sizeIconMarkup.js';

import { TEAM_PLAN_TIER_DIAMOND_SYMBOL } from '@/scenes/team/teamPlanTier';

type TeamPlanTierDiamondIconProps = {
  /** 与版本文案同色（`teamPlanTierLabelColor`）。 */
  color: string;
  displayPx: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** `eds-diamond-fill` · 按版本强调色着色（`EgSymbol` 仅支持 token，此处与标签文案色对齐）。 */
export function TeamPlanTierDiamondIcon({
  color,
  displayPx,
  style,
  testID,
}: TeamPlanTierDiamondIconProps) {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setXml(null);
      const iconAsset = await loadIconAsset(TEAM_PLAN_TIER_DIAMOND_SYMBOL);
      if (cancelled || !iconAsset) {
        return;
      }

      const nextXml =
        iconAsset.colorMode === 'token'
          ? colorizeTokenIconMarkup(iconAsset, {
              strokeColor: color,
              fillColor: color,
              displayPx,
            })
          : sizeIconMarkup(iconAsset.markup, displayPx);

      if (!cancelled) {
        setXml(nextXml);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [color, displayPx]);

  return (
    <View
      testID={testID}
      style={[{ width: displayPx, height: displayPx }, style]}
      accessibilityRole={xml ? 'image' : undefined}
      accessibilityLabel=""
    >
      {xml ? <EgAtomSvg xml={xml} width={displayPx} height={displayPx} /> : null}
    </View>
  );
}