import { useMemo } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import type { HomeStackParamList } from '@/navigation/types';
import { HomeTodoEmptyState } from '@/scenes/home/HomeTodoEmptyState';
import { MessagesNavClearButton } from '@/scenes/messages/MessagesNavClearButton';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesCollaborationListRow } from '@/scenes/messages/MessagesCollaborationListRow';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';
import { MessagesTeamActivityListRow } from '@/scenes/messages/MessagesTeamActivityListRow';
import { MessagesTransactionListRow } from '@/scenes/messages/MessagesTransactionListRow';
import { MessagesListSectionHeader } from '@/scenes/messages/MessagesListSectionHeader';
import { formatMessageTimeLabel } from '@/scenes/messages/messagesFormat';
import { messageCategoryLabelKey } from '@/scenes/messages/messagesCategoryPreview';
import { messagesDataListRowGap } from '@/scenes/messages/messagesDataListLayout';
import { resolveMessagesSectionLabel } from '@/scenes/messages/messagesSectionLabel';
import {
  MESSAGE_MOCK_ITEMS,
  groupMessageItemsByDateSection,
} from '@/scenes/messages/messagesMock';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type MessagesCategorySceneProps = {
  route: RouteProp<HomeStackParamList, 'MessagesCategory'>;
};

/** 通知分类内页 · 无顶部分段 Tab。 */
export function MessagesCategoryScene({ route }: MessagesCategorySceneProps) {
  const { category } = route.params;
  const { t, i18n } = useTranslation();
  const { spacing } = useEdsTheme();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const sceneInset = edsSceneContentInset(spacing);
  const sectionGroupGap = edsPx(spacing['spacing-7']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: { gap: edsPx(spacing['spacing-1-5']) },
      }),
    [spacing],
  );

  const sectionBuckets = useMemo(
    () => groupMessageItemsByDateSection(MESSAGE_MOCK_ITEMS, category),
    [category],
  );

  const hasListRows = useMemo(
    () => sectionBuckets.some((rows) => rows.length > 0),
    [sectionBuckets],
  );

  return (
    <SceneScaffold
      title={t(messageCategoryLabelKey[category])}
      showNavBack
      shortPageScrollLayout
      overlayNavTrailing={nativeNavBar ? undefined : <MessagesNavClearButton />}
    >
      <EgDataList sceneContentInset={sceneInset} rowGap={sectionGroupGap}>
        {!hasListRows ? (
          <HomeTodoEmptyState />
        ) : (
          sectionBuckets.map((rows, sectionDayOffset) => {
            if (rows.length === 0) return null;
            const sectionLabel = resolveMessagesSectionLabel(
              sectionDayOffset,
              t,
              i18n.language,
            );
            return (
              <View key={`section-${sectionDayOffset}`} style={styles.section}>
                <MessagesListSectionHeader label={sectionLabel} />
                <EgDataList sceneContentInset={0} rowGap={messagesDataListRowGap(spacing)}>
                  {rows.map((item) =>
                    item.teamActivity ? (
                      <MessagesTeamActivityListRow
                        key={item.id}
                        activity={item.teamActivity}
                        timeLabel={formatMessageTimeLabel(item.timeHm)}
                        unread={item.unread}
                        onPress={() => undefined}
                      />
                    ) : item.collaboration ? (
                      <MessagesCollaborationListRow
                        key={item.id}
                        collab={item.collaboration}
                        timeLabel={formatMessageTimeLabel(item.timeHm)}
                        unread={item.unread}
                        onPress={() => undefined}
                      />
                    ) : item.transaction ? (
                      <MessagesTransactionListRow
                        key={item.id}
                        tx={item.transaction}
                        timeLabel={formatMessageTimeLabel(item.timeHm)}
                        unread={item.unread}
                        onPress={() => undefined}
                      />
                    ) : (
                      <MessagesListRow
                        key={item.id}
                        title={t(item.titleKey!)}
                        subtitle={t(item.subtitleKey!)}
                        timeLabel={formatMessageTimeLabel(item.timeHm)}
                        unread={item.unread}
                        avatarLetter={item.avatarLetter}
                        avatarColorIndex={item.avatarColorIndex}
                        leadSymbol={item.leadSymbol}
                        leadSystemPlaceholder={item.category === 'announcement'}
                        onPress={() => undefined}
                      />
                    ),
                  )}
                </EgDataList>
              </View>
            );
          })
        )}
      </EgDataList>
    </SceneScaffold>
  );
}