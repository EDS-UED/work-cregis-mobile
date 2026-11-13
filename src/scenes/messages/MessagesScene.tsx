import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { HomeTodoEmptyState } from '@/scenes/home/HomeTodoEmptyState';
import { HomeTodoFilterBar } from '@/scenes/home/HomeTodoFilterBar';
import { MessagesNavClearButton } from '@/scenes/messages/MessagesNavClearButton';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesCollaborationListRow } from '@/scenes/messages/MessagesCollaborationListRow';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';
import { MessagesTeamActivityListRow } from '@/scenes/messages/MessagesTeamActivityListRow';
import { MessagesTransactionListRow } from '@/scenes/messages/MessagesTransactionListRow';
import { MessagesListSectionHeader } from '@/scenes/messages/MessagesListSectionHeader';
import { resolveMessagesSectionLabel } from '@/scenes/messages/messagesSectionLabel';
import {
  type MessageCategory,
  MESSAGE_MOCK_ITEMS,
  groupMessageItemsByDateSection,
  messageCategoryUnreadCounts,
} from '@/scenes/messages/messagesMock';
import { dataListRowGap, dataListSectionStyle } from '@/scenes/shared/dataListLayout';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { edsPx } from '@/utils/edsTheme';

const MESSAGE_CATEGORY_ORDER: MessageCategory[] = [
  'transaction',
  'teamActivity',
  'collaboration',
  'announcement',
  'amlAlert',
];

/** 通知中心 · EDS page 推入；顶部分段与首页待办 `HomeTodoFilterBar` 一致。 */
export function MessagesScene() {
  const { t, i18n } = useTranslation();
  const { spacing } = useEdsTheme();
  const [category, setCategory] = useState<MessageCategory>('transaction');
  const nativeNavBar = shouldUseEgNavBarNativeStack();

  const styles = useMemo(() => {
    const tabBlockBodyGap = edsPx(spacing['spacing-5']);
    const tabToCalendarGap = edsPx(spacing['spacing-8']);
    const sectionGroupGap = edsPx(spacing['spacing-7']);
    return StyleSheet.create({
      root: { flexGrow: 1 },
      content: {
        ...dataListSectionStyle(spacing),
        /** ① Tab ↔ 首行日历标题 · 合计 `spacing-8`（32px）= TabBlock 默认 20 + 补足。 */
        paddingTop: tabToCalendarGap - tabBlockBodyGap,
        /** ③ 组 ↔ 组 · `spacing-7`（28px）。 */
        gap: sectionGroupGap,
      },
      /** ② 日历标题 ↔ 列表 · `spacing-1-5`（6px）。 */
      section: { gap: edsPx(spacing['spacing-1-5']) },
      sectionRows: { gap: dataListRowGap(spacing) },
    });
  }, [spacing]);

  const categoryLabelKey: Record<MessageCategory, `messages.${string}`> = {
    transaction: 'messages.categoryTransaction',
    teamActivity: 'messages.categoryTeamActivity',
    collaboration: 'messages.categoryCollaboration',
    announcement: 'messages.categoryAnnouncement',
    amlAlert: 'messages.categoryAmlAlert',
  };

  const categoryUnreadCounts = useMemo(
    () => messageCategoryUnreadCounts(MESSAGE_MOCK_ITEMS),
    [],
  );

  const resolvedFilterOptions = useMemo(
    () =>
      MESSAGE_CATEGORY_ORDER.map((id) => ({
        id,
        label: t(categoryLabelKey[id]),
        count: categoryUnreadCounts[id],
      })),
    [categoryUnreadCounts, t],
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
      title={t('messages.title')}
      showNavBack
      overlayNavTrailing={nativeNavBar ? undefined : <MessagesNavClearButton />}
    >
      <View style={styles.root}>
        <HomeTodoFilterBar
          options={resolvedFilterOptions}
          selectedId={category}
          onSelect={setCategory}
          contentKey={category}
        >
          <View style={styles.content}>
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
                    <View style={styles.sectionRows}>
                      {rows.map((item) =>
                        item.teamActivity ? (
                          <MessagesTeamActivityListRow
                            key={item.id}
                            activity={item.teamActivity}
                            timeLabel={item.timeHm}
                            unread={item.unread}
                            onPress={() => undefined}
                          />
                        ) : item.collaboration ? (
                          <MessagesCollaborationListRow
                            key={item.id}
                            collab={item.collaboration}
                            timeLabel={item.timeHm}
                            unread={item.unread}
                            onPress={() => undefined}
                          />
                        ) : item.transaction ? (
                          <MessagesTransactionListRow
                            key={item.id}
                            tx={item.transaction}
                            timeLabel={item.timeHm}
                            unread={item.unread}
                            onPress={() => undefined}
                          />
                        ) : (
                          <MessagesListRow
                            key={item.id}
                            title={t(item.titleKey!)}
                            subtitle={t(item.subtitleKey!)}
                            timeLabel={item.timeHm}
                            unread={item.unread}
                            avatarLetter={item.avatarLetter}
                            avatarColorIndex={item.avatarColorIndex}
                            leadSymbol={item.leadSymbol}
                            leadSystemPlaceholder={item.category === 'announcement'}
                            onPress={() => undefined}
                          />
                        ),
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </HomeTodoFilterBar>
      </View>
    </SceneScaffold>
  );
}
