import { useMemo } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDataList, egDataListRowGap } from '@/eds/data-list';
import type { HomeStackParamList } from '@/navigation/types';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';
import { HomeTodoEmptyState } from '@/scenes/home/HomeTodoEmptyState';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';
import { MessagesNavClearButton } from '@/scenes/messages/MessagesNavClearButton';
import { MessagesListSectionHeader } from '@/scenes/messages/MessagesListSectionHeader';
import { resolveNotificationCopy } from '@/scenes/messages/notificationExamples';
import { messageCategoryLabelKey } from '@/scenes/messages/messagesCategoryPreview';
import { resolveMessagesSectionLabel } from '@/scenes/messages/messagesSectionLabel';
import {
  MESSAGE_MOCK_ITEMS,
  groupMessageItemsByDateSection,
} from '@/scenes/messages/messagesMock';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useHomeStore } from '@/store';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type MessagesCategorySceneProps = {
  route: RouteProp<HomeStackParamList, 'MessagesCategory'>;
};

/** 通知分类内页 · 无顶部分段 Tab。 */
export function MessagesCategoryScene({ route }: MessagesCategorySceneProps) {
  const { category } = route.params;
  const navigation = useHomeStackNavigation();
  const { t, i18n } = useTranslation();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const notificationsMarkedRead = useHomeStore((state) => state.notificationsMarkedRead);
  const markAllNotificationsRead = useHomeStore((state) => state.markAllNotificationsRead);
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
      overlayNavTrailing={
        nativeNavBar ? undefined : <MessagesNavClearButton onPress={markAllNotificationsRead} />
      }
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
                <EgDataList sceneContentInset={0} rowGap={egDataListRowGap()}>
                  {rows.map((item) => {
                    const copy = item.notice
                      ? resolveNotificationCopy(item.notice.copy, i18n.language)
                      : {
                          title: item.titleKey ? t(item.titleKey) : '',
                          body: item.subtitleKey ? t(item.subtitleKey) : '',
                        };
                    const announcementId =
                      category === 'announcement' ? item.notice?.templateKey : undefined;
                    const canOpen = item.notice?.canRedirect === true;
                    return (
                      <MessagesListRow
                        key={item.id}
                        title={copy.title}
                        subtitle={announcementId ? '' : copy.body}
                        timeLabel={item.timeHm}
                        unread={notificationsMarkedRead ? false : item.unread}
                        showArrow={!announcementId && canOpen}
                        onPress={
                          announcementId
                            ? () => navigation.navigate('MessagesAnnouncement', { id: announcementId })
                            : canOpen
                              ? () => undefined
                              : undefined
                        }
                      />
                    );
                  })}
                </EgDataList>
              </View>
            );
          })
        )}
      </EgDataList>
    </SceneScaffold>
  );
}