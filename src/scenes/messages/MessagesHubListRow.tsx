import { View } from 'react-native';

import { EgMessage } from '@/eds/feedback';
import { formatNotificationCountBadge } from '@/scenes/messages/messagesFormat';
import type { CategoryHubSubtitleSegments } from '@/scenes/messages/messagesCategoryPreview';
import type { MessageCategory } from '@/scenes/messages/messagesMock';
import { MessagesCategoryHubLeadIcon } from '@/scenes/messages/MessagesCategoryHubLeadIcon';
import {
  EgDataListPrimaryText,
  EgDataListRow,
  EgDataListSubText,
} from '@/eds/data-list';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useTranslation } from 'react-i18next';
import { edsPx } from '@/utils/edsTheme';

type MessagesHubListRowProps = {
  category: MessageCategory;
  title: string;
  subtitle: CategoryHubSubtitleSegments;
  timeLabel?: string;
  unreadCount?: number;
  onPress?: () => void;
};

export function MessagesHubListRow({
  category,
  title,
  subtitle,
  timeLabel,
  unreadCount = 0,
  onPress,
}: MessagesHubListRowProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);
  const unreadLabel = formatNotificationCountBadge(unreadCount);

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={title}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
      testID={`messages-hub-row-${category}`}
    >
      <MessagesCategoryHubLeadIcon category={category} />
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            alignSelf: 'stretch',
          }}
        >
          <EgDataListPrimaryText
            mode={mode}
            weight="heavy"
            numberOfLines={1}
            style={{ flex: 1, minWidth: 0 }}
          >
            {title}
          </EgDataListPrimaryText>
          {timeLabel ? (
            <SceneText variant="bodySmallTertiary">{timeLabel}</SceneText>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            alignSelf: 'stretch',
          }}
        >
          <EgDataListSubText
            mode={mode}
            segmentA={subtitle.segmentA}
            segmentB={subtitle.segmentB}
            boldSegmentA={subtitle.boldSegmentA === true}
            style={{ flex: 1, minWidth: 0 }}
          />
          {unreadLabel ? (
            <EgMessage
              mode={mode}
              tone="danger"
              label={unreadLabel}
              accessibilityLabel={t('messages.unreadBadge')}
              testID={`messages-hub-message-${category}`}
            />
          ) : null}
        </View>
      </View>
    </EgDataListRow>
  );
}