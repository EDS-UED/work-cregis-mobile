import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import type { MessageCategory } from '@/scenes/messages/messagesMock';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

/** 前置页分类行首 · `capsule-lg` + `material-brand-weaken` + `stroke-decor`。 */
const HUB_LEAD_ICON_BY_CATEGORY: Record<MessageCategory, string> = {
  transaction: 'eds-coin-trading-fill',
  collaboration: 'eds-circulation-fill',
  amlAlert: 'eds-alarm-fill',
  teamActivity: 'eds-team-fill',
  announcement: 'eds-push-fill',
};

type MessagesCategoryHubLeadIconProps = {
  category: MessageCategory;
};

export function MessagesCategoryHubLeadIcon({
  category,
}: MessagesCategoryHubLeadIconProps) {
  const { mode, colors, spacing } = useEdsTheme();
  const slot = edsPx(spacing['capsule-lg']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          width: slot,
          height: slot,
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: String(colors['material-brand-weaken']),
        },
      }),
    [colors, slot, spacing],
  );

  return (
    <View style={styles.shell}>
      <EgSymbol
        name={HUB_LEAD_ICON_BY_CATEGORY[category]}
        mode={mode}
        size="md"
        fillTone="decor"
        strokeColorToken="stroke-decor"
        accessibilityLabel=""
      />
    </View>
  );
}