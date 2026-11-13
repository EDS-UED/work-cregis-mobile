import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useEdsTypography } from '@/hooks/useEdsTypography';
import { formatMessageAddressShort } from '@/scenes/messages/messagesFormat';
import type { MessageTransactionMock } from '@/scenes/messages/messagesMock';
import { MessagesListLeadIcon } from '@/scenes/messages/MessagesListLeadIcon';
import { DataListRow } from '@/scenes/shared/DataListRow';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type MessagesTransactionListRowProps = {
  tx: MessageTransactionMock;
  timeLabel: string;
  unread?: boolean;
  onPress?: () => void;
};

/** 通知 · 交易 Tab 行 · 币种图 + 金额 + 发送/接收副文案。 */
export function MessagesTransactionListRow({
  tx,
  timeLabel,
  unread,
  onPress,
}: MessagesTransactionListRowProps) {
  const { t } = useTranslation();
  const text = useEdsTypography();
  const { spacing, colors } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const mediaGap = edsPx(spacing['spacing-3']);
  const secondaryColor = String(colors['text-base-secondary']);
  const amountA11y = `${tx.amount} ${tx.currency}`;

  const subtitle =
    tx.direction === 'send' ? (
      <Text
        style={[text.bodySmallSecondary, { color: secondaryColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        <Text style={[text.bodySmallMedium, { color: secondaryColor }]}>
          {t('messages.txSend')}
        </Text>
        {` ${t('messages.txSendRoute', {
          from: formatMessageAddressShort(tx.addressFrom ?? ''),
          to: formatMessageAddressShort(tx.addressTo ?? ''),
        })}`}
      </Text>
    ) : (
      <Text
        style={[text.bodySmallSecondary, { color: secondaryColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        <Text style={[text.bodySmallMedium, { color: secondaryColor }]}>
          {t('messages.txReceive')}
        </Text>
        {` ${t('messages.txReceiveDetail', {
          walletName: tx.walletName ?? '',
          address: formatMessageAddressShort(tx.walletAddress ?? ''),
        })}`}
      </Text>
    );

  return (
    <DataListRow
      accessibilityLabel={amountA11y}
      onPress={onPress}
      layout={layout}
      gap={mediaGap}
    >
      <MessagesListLeadIcon unread={unread} cryptoCurrency={tx.currency} />
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
            <SceneText variant="bodySemibold">{tx.amount}</SceneText>
            <SceneText variant="bodySemibold">{tx.currency}</SceneText>
          </View>
          <SceneText variant="bodySmallTertiary">{timeLabel}</SceneText>
        </View>
        {subtitle}
      </View>
    </DataListRow>
  );
}
