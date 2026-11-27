import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { MessageCategory } from '@/scenes/messages/messagesMock';
import {
  MESSAGE_HUB_LEAD_HUE_BY_CATEGORY,
  messageHubLeadHueShellHex,
  messageHubLeadHueUsesLightGlyph,
} from '@/scenes/messages/messagesCategoryHubLeadHue';
import {
  messagesHubLeadSlotPx,
  messagesHubLeadSymbolPx,
} from '@/scenes/messages/messagesHubLeadIconMetrics';
import { edsPx } from '@/utils/edsTheme';

const HUB_LEAD_ICON_BY_CATEGORY: Record<MessageCategory, string> = {
  transaction: 'eds-coin-trading',
  collaboration: 'eds-circulation',
  amlAlert: 'eds-alarm',
  teamActivity: 'eds-team',
  announcement: 'eds-push',
};

type MessagesCategoryHubLeadIconProps = {
  category: MessageCategory;
};

/** 通知前置 · `capsule-md` + Palette Hue 底 + 线框 · `symbol-sm` · 白描边（五色头像）。 */
export function MessagesCategoryHubLeadIcon({
  category,
}: MessagesCategoryHubLeadIconProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const slot = messagesHubLeadSlotPx(spacing);
  const iconPx = messagesHubLeadSymbolPx(spacing);
  const hueId = MESSAGE_HUB_LEAD_HUE_BY_CATEGORY[category];
  const shellBg = messageHubLeadHueShellHex(hueId, mode, colors as Record<string, unknown>);
  const lightGlyph = messageHubLeadHueUsesLightGlyph(hueId, mode);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          width: slot,
          height: slot,
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
        name={HUB_LEAD_ICON_BY_CATEGORY[category]}
        mode={mode}
        displayPx={iconPx}
        fillTone={lightGlyph ? 'primary' : 'decor'}
        strokeColorToken={lightGlyph ? 'text-base-primary' : 'stroke-same-white'}
        accessibilityLabel=""
      />
    </View>
  );
}