import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesCategoryBar } from '@/scenes/messages/MessagesCategoryBar';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';
import {
  MESSAGE_MOCK_ITEMS,
  type MessageCategory,
  type MessageListItemDef,
} from '@/scenes/messages/messagesMock';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const SECTION_ORDER = ['today', 'yesterday'] as const;

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

/** 消息中心 · EDS page 推入；Mock 列表对齐设计稿。 */
export function MessagesScene() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const [category, setCategory] = useState<MessageCategory>('team');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { gap: edsPx(spacing['spacing-4']) },
        section: { gap: edsPx(spacing['spacing-1']) },
        sectionTitle: {
          marginHorizontal: edsPx(spacing['spacing-3']),
          marginBottom: edsPx(spacing['spacing-1']),
        },
      }),
    [spacing],
  );

  const grouped = useMemo(() => groupBySection(MESSAGE_MOCK_ITEMS, category), [category]);

  return (
    <SceneScaffold title={t('messages.title')} showNavBack>
      <View style={styles.root}>
        <MessagesCategoryBar active={category} onChange={setCategory} />
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
    </SceneScaffold>
  );
}
