import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useEdsTypography } from '@/hooks/useEdsTypography';
import type { MessageCollaborationMock } from '@/scenes/messages/messagesCollaborationMock';
import { EgDataListReddot, EgDataListRow } from '@/eds/data-list';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type MessagesCollaborationListRowProps = {
  collab: MessageCollaborationMock;
  timeLabel: string;
  unread?: boolean;
  onPress?: () => void;
};

/** 通知 · 协作 Tab · 单行副文案：成员名 `bodySmallStrong`（500）+ 业务说明。 */
export function MessagesCollaborationListRow({
  collab,
  timeLabel,
  unread,
  onPress,
}: MessagesCollaborationListRowProps) {
  const { t } = useTranslation();
  const text = useEdsTypography();
  const { mode, spacing, colors } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);
  const secondaryColor = String(colors['text-base-secondary']);
  const amountA11y = `${collab.amount} ${collab.currency}`;

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={amountA11y}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <View style={{ flex: 1, minWidth: 0, gap: edsPx(spacing['spacing-05']) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            alignSelf: 'stretch',
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: 0,
              flexDirection: 'row',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: edsPx(spacing['spacing-2']),
            }}
          >
            <SceneText variant="bodySemibold">{collab.amount}</SceneText>
            <SceneText variant="bodySemibold">{collab.currency}</SceneText>
          </View>
          <SceneText variant="bodySmallTertiary">{timeLabel}</SceneText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            alignSelf: 'stretch',
          }}
        >
          <Text
            style={[text.bodySmallSecondary, { color: secondaryColor, flex: 1, minWidth: 0 }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <Text style={text.bodySmallStrong}>{collab.memberName}</Text>
            {` ${t('messages.collabPaymentRequest')}`}
          </Text>
          {unread ? (
            <EgDataListReddot mode={mode} accessibilityLabel={t('messages.unreadBadge')} />
          ) : null}
        </View>
      </View>
    </EgDataListRow>
  );
}
