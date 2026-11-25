import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import type { HomeStackParamList } from '@/navigation/types';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { MessagesHubListRow } from '@/scenes/messages/MessagesHubListRow';
import { MessagesNavClearButton } from '@/scenes/messages/MessagesNavClearButton';
import {
  MESSAGE_HUB_CATEGORY_ORDER,
  formatCategoryHubSubtitleSegments,
  formatCategoryHubTimeLabel,
  getLeadingMessageForCategory,
  messageCategoryLabelKey,
} from '@/scenes/messages/messagesCategoryPreview';
import {
  MESSAGE_MOCK_ITEMS,
  messageCategoryUnreadCounts,
  type MessageCategory,
} from '@/scenes/messages/messagesMock';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { messagesHubRowGap } from '@/scenes/messages/messagesDataListLayout';
import { edsSceneContentInset } from '@/utils/edsTheme';

type MessagesHubNav = StackNavigationProp<HomeStackParamList, 'Messages'>;

/** 通知前置页 · 五类入口；内页见 `MessagesCategoryScene`。 */
export function MessagesHubScene() {
  const { t } = useTranslation();
  const navigation = useNavigation<MessagesHubNav>();
  const { spacing } = useEdsTheme();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const sceneInset = edsSceneContentInset(spacing);

  const unreadByCategory = useMemo(
    () => messageCategoryUnreadCounts(MESSAGE_MOCK_ITEMS),
    [],
  );

  const rows = useMemo(
    () =>
      MESSAGE_HUB_CATEGORY_ORDER.map((category) => {
        const lead = getLeadingMessageForCategory(category);
        const unreadCount = unreadByCategory[category];
        return {
          category,
          title: t(messageCategoryLabelKey[category]),
          subtitle: formatCategoryHubSubtitleSegments(category, lead, t),
          timeLabel: formatCategoryHubTimeLabel(lead),
          unreadCount,
        };
      }),
    [t, unreadByCategory],
  );

  const openCategory = (category: MessageCategory) => {
    navigation.navigate('MessagesCategory', { category });
  };

  return (
    <SceneScaffold
      title={t('messages.title')}
      showNavBack
      shortPageScrollLayout
      overlayNavTrailing={nativeNavBar ? undefined : <MessagesNavClearButton />}
    >
      <EgDataList sceneContentInset={sceneInset} rowGap={messagesHubRowGap(spacing)}>
        {rows.map((row, index) => (
          <MessagesHubListRow
            key={row.category}
            category={row.category}
            title={row.title}
            subtitle={row.subtitle}
            timeLabel={row.timeLabel}
            unreadCount={row.unreadCount}
            onPress={() => openCategory(row.category)}
            isLast={index === rows.length - 1}
          />
        ))}
      </EgDataList>
    </SceneScaffold>
  );
}