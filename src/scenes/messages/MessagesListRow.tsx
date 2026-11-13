import type { ImageSourcePropType } from 'react-native';
import { View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesListLeadIcon } from '@/scenes/messages/MessagesListLeadIcon';
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
  avatarName?: string;
  avatarSource?: ImageSourcePropType;
  avatarColorIndex?: number;
  leadSymbol?: string;
  leadSystemPlaceholder?: boolean;
  leadDangerRefuse?: boolean;
  onPress?: () => void;
};

/** 消息列表行 · 行首 `avatar-xl` + 主副文案 + 时间。 */
export function MessagesListRow({
  title,
  subtitle,
  timeLabel,
  unread,
  avatarLetter,
  avatarName,
  avatarSource,
  avatarColorIndex,
  leadSymbol,
  leadSystemPlaceholder,
  leadDangerRefuse,
  onPress,
}: MessagesListRowProps) {
  const { spacing } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);

  return (
    <DataListRow
      accessibilityLabel={title}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <MessagesListLeadIcon
        unread={unread}
        avatarLetter={avatarLetter}
        avatarName={avatarName}
        avatarSource={avatarSource}
        avatarColorIndex={avatarColorIndex}
        leadSymbol={leadSymbol}
        leadSystemPlaceholder={leadSystemPlaceholder}
        leadDangerRefuse={leadDangerRefuse}
      />
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            alignSelf: 'stretch',
          }}
        >
          <SceneText variant="bodySemibold" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
            {title}
          </SceneText>
          <SceneText variant="bodySmallTertiary">{timeLabel}</SceneText>
        </View>
        <SceneText variant="bodySmallSecondary" numberOfLines={2} ellipsizeMode="tail">
          {subtitle}
        </SceneText>
      </View>
    </DataListRow>
  );
}
