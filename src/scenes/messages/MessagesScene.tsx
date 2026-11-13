import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HomeTodoFilterBar } from '@/scenes/home/HomeTodoFilterBar';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';
import {
  MESSAGE_CATEGORY_BADGE,
  type MessageCategory,
  type MessageListItemDef,
  MESSAGE_MOCK_ITEMS,
} from '@/scenes/messages/messagesMock';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const SECTION_ORDER = ['today', 'yesterday'] as const;

const MESSAGE_CATEGORY_ORDER: MessageCategory[] = [
  'transaction',
  'teamActivity',
  'collaboration',
  'announcement',
  'amlAlert',
];

function groupBySection(
  items: MessageListItemDef[],
  category: MessageCategory,
): Record<(typeof SECTION_ORDER)[number], MessageListItemDef[]> {
  const filtered = items.filter((item) => item.category === category);
  return {
    today: filtered.filter((item) => item.sectionKey === 'today'),
    yesterday: filtered.filter((item) => item.sectionKey === 'yesterday'),
  };
}

/** 通知中心 · EDS page 推入；顶部分段与首页待办 `HomeTodoFilterBar` 一致。 */
export function MessagesScene() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const [category, setCategory] = useState<MessageCategory>('transaction');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flexGrow: 1 },
        content: { gap: edsPx(spacing['spacing-4']) },
        section: { gap: edsPx(spacing['spacing-1']) },
        sectionTitle: {
          marginHorizontal: edsPx(spacing['spacing-3']),
          marginBottom: edsPx(spacing['spacing-1']),
        },
      }),
    [spacing],
  );

  const categoryLabelKey: Record<MessageCategory, `messages.${string}`> = {
    transaction: 'messages.categoryTransaction',
    teamActivity: 'messages.categoryTeamActivity',
    collaboration: 'messages.categoryCollaboration',
    announcement: 'messages.categoryAnnouncement',
    amlAlert: 'messages.categoryAmlAlert',
  };

  const resolvedFilterOptions = useMemo(
    () =>
      MESSAGE_CATEGORY_ORDER.map((id) => ({
        id,
        label: t(categoryLabelKey[id]),
        count: MESSAGE_CATEGORY_BADGE[id],
      })),
    [t],
  );

  const grouped = useMemo(() => groupBySection(MESSAGE_MOCK_ITEMS, category), [category]);

  return (
    <SceneScaffold title={t('messages.title')} showNavBack>
      <View style={styles.root}>
        <HomeTodoFilterBar
          options={resolvedFilterOptions}
          selectedId={category}
          onSelect={setCategory}
          contentKey={category}
        >
          <View style={styles.content}>
        {SECTION_ORDER.map((sectionKey) => {
          const rows = grouped[sectionKey];
          if (rows.length === 0) return null;
          const sectionLabel =
            sectionKey === 'today' ? t('messages.sectionToday') : t('messages.sectionYesterday');
          return (
            <View key={sectionKey} style={styles.section}>
              <SceneText variant="bodySmallSecondary" style={styles.sectionTitle}>
                {sectionLabel}
              </SceneText>
              {rows.map((item) => (
                <MessagesListRow
                  key={item.id}
                  title={t(item.titleKey)}
                  subtitle={t(item.subtitleKey)}
                  timeLabel={t(item.timeLabelKey)}
                  unread={item.unread}
                  avatarLetter={item.avatarLetter}
                  avatarColorIndex={item.avatarColorIndex}
                  leadSymbol={item.leadSymbol}
                  onPress={() => undefined}
                />
              ))}
            </View>
          );
        })}
          </View>
        </HomeTodoFilterBar>
      </View>
    </SceneScaffold>
  );
}
