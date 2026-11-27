import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  messageHubLeadHueShellHex,
  messageHubLeadHueUsesLightGlyph,
} from '@/scenes/messages/messagesCategoryHubLeadHue';
import type { TeamSecurityRowId } from '@/scenes/team/detail/teamCenterDetailMock';
import {
  TEAM_SECURITY_LEAD_HUE_BY_ROW,
  TEAM_SECURITY_LEAD_ICON_BY_ROW,
} from '@/scenes/team/detail/teamSecurityLeadHue';
import {
  teamSecurityLeadSlotPx,
  teamSecurityLeadSymbolPx,
} from '@/scenes/team/detail/teamSecurityLeadIconMetrics';
import { edsPx } from '@/utils/edsTheme';

type TeamSecurityLeadIconProps = {
  rowId: TeamSecurityRowId;
};

/** 团队安全 · EgDataList 图形 `md` + Palette Hue 底 + 线框。 */
export function TeamSecurityLeadIcon({ rowId }: TeamSecurityLeadIconProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const slot = teamSecurityLeadSlotPx(spacing);
  const iconPx = teamSecurityLeadSymbolPx(spacing);
  const hueId = TEAM_SECURITY_LEAD_HUE_BY_ROW[rowId];
  const shellBg = messageHubLeadHueShellHex(hueId, mode, colors as Record<string, unknown>);
  const lightGlyph = messageHubLeadHueUsesLightGlyph(hueId, mode);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          width: slot,
          height: slot,
          flexShrink: 0,
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: shellBg,
        },
      }),
    [shellBg, slot, spacing],
  );

  return (
    <View style={styles.shell}>
      <EgSymbol
        name={TEAM_SECURITY_LEAD_ICON_BY_ROW[rowId]}
        mode={mode}
        displayPx={iconPx}
        fillTone={lightGlyph ? 'primary' : 'decor'}
        strokeColorToken={lightGlyph ? 'text-base-primary' : 'stroke-same-white'}
        accessibilityLabel=""
      />
    </View>
  );
}