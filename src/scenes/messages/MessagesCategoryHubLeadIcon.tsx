import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import mobileTheme from '@/eds/tokens';
import type { MessageCategory } from '@/scenes/messages/messagesMock';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type ThemeMode = 'light' | 'dark';

/** 前置页分类圆标。底色跟主设计：深绿 / 品牌绿 / 橙 / 海军蓝 / 天蓝，字形白色。 */
const HUB_LEAD_ICON: Record<MessageCategory, string> = {
  transaction: 'eds-coin-trading-fill',
  collaboration: 'eds-circulation-fill',
  amlAlert: 'eds-alarm-fill',
  teamActivity: 'eds-team-fill',
  announcement: 'eds-push-fill',
};

const TAG_BAR = mobileTheme.tags.custom as Record<
  'orange' | 'clear-sky',
  Record<ThemeMode, { bar: string }>
>;

type MessagesCategoryHubLeadIconProps = {
  category: MessageCategory;
};

export function MessagesCategoryHubLeadIcon({
  category,
}: MessagesCategoryHubLeadIconProps) {
  const { mode, colors, spacing } = useEdsTheme();
  const slot = edsPx(spacing['capsule-lg']);
  const background = hubLeadBackground(category, mode, colors);

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
          backgroundColor: background,
        },
      }),
    [background, slot, spacing],
  );

  return (
    <View style={styles.shell}>
      <EgSymbol
        name={HUB_LEAD_ICON[category]}
        mode={mode}
        size="md"
        fillTone="primary"
        strokeColorToken="text-same-white"
        accessibilityLabel=""
      />
    </View>
  );
}

function hubLeadBackground(
  category: MessageCategory,
  mode: ThemeMode,
  colors: Record<string, string>,
): string {
  switch (category) {
    case 'transaction':
      return String(colors['material-decor']);
    case 'collaboration':
      return String(colors['material-brand']);
    case 'amlAlert':
      return TAG_BAR.orange[mode].bar;
    case 'teamActivity':
      return String(colors['material-match']);
    case 'announcement':
      return TAG_BAR['clear-sky'][mode].bar;
  }
}
