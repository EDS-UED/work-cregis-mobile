import { View } from 'react-native';

import { EgAvatar } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { DataListRow } from '@/scenes/shared/DataListRow';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type MessagesListRowProps = {
  title: string;
  subtitle: string;
  timeLabel: string;
  unread?: boolean;
  avatarLetter?: string;
  avatarColorIndex?: number;
  leadSymbol?: string;
  onPress?: () => void;
};

/** 消息列表行 · 未读点 + 头像或 icon + 主副文案 + 时间。 */
export function MessagesListRow({
  title,
  subtitle,
  timeLabel,
  unread,
  avatarLetter,
  avatarColorIndex,
  leadSymbol,
  onPress,
}: MessagesListRowProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);

  return (
    <DataListRow
      accessibilityLabel={title}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      {unread ? (
        <View
          style={{
            width: edsPx(spacing['spacing-2']),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: edsPx(spacing['spacing-2']),
              height: edsPx(spacing['spacing-2']),
              borderRadius: edsPx(spacing['radius-full']),
              backgroundColor: String(colors.brand),
            }}
          />
        </View>
      ) : (
        <View style={{ width: edsPx(spacing['spacing-2']) }} />
      )}
      {avatarLetter != null ? (
        <EgAvatar
          name={avatarLetter}
          size="xl"
          colorIndex={avatarColorIndex}
          accessibilityLabel=""
        />
      ) : leadSymbol ? (
        <View
          style={{
            width: edsPx(spacing['capsule-md']),
            height: edsPx(spacing['capsule-md']),
            borderRadius: edsPx(spacing['radius-full']),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: String(colors['material-card-shallow']),
          }}
        >
          <EgSymbol name={leadSymbol} mode={mode} size="md" accessibilityLabel="" />
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
        <SceneText variant="bodyMediumStrong" numberOfLines={1}>
          {title}
        </SceneText>
        <SceneText variant="bodySmallSecondary" numberOfLines={2}>
          {subtitle}
        </SceneText>
      </View>
      <SceneText variant="bodySmallTertiary">{timeLabel}</SceneText>
    </DataListRow>
  );
}
