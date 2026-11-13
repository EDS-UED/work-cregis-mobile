import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { EgButtonGlass } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { egTabBarScrollContentReserveWithSafeArea } from '@/eds/nav-bar';
import { shouldUseEgTabBarNativeStack } from '@/eds/runtime';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { CollaborationTodoRow } from '@/scenes/collaboration/CollaborationTodoRow';
import { SceneText } from '@/scenes/shared/SceneText';
import { dataListSectionStyle } from '@/scenes/shared/dataListLayout';
import type { CollaborationStackParamList } from '@/navigation/types';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useCollaborationStore, type CollaborationItem } from '@/store';
import {
  edsNavContentGap,
  edsPageBackground,
  edsPx,
  edsSceneContentInset,
} from '@/utils/edsTheme';

type Props = StackScreenProps<CollaborationStackParamList, 'CollaborationList'>;

function collaborationRowTitle(item: CollaborationItem) {
  return `${item.amount} ${item.currency}`;
}

export function CollaborationListScene({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const nativeTabBar = shouldUseEgTabBarNativeStack();
  const tabBarReserve = nativeTabBar
    ? 0
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);

  const items = useCollaborationStore((state) => state.items);
  const headerBadgeCount = useCollaborationStore((state) => state.headerBadgeCount);
  const totalPendingCount = useCollaborationStore((state) => state.totalPendingCount);

  const signKindLabel = useCallback(
    (kind: CollaborationItem['signKind']) => {
      if (kind === 'single') return t('scenes.collaborationSignSingle');
      if (kind === 'multi') return t('scenes.collaborationSignMulti');
      return t('scenes.collaborationSignApproval');
    },
    [t],
  );

  const actionLine = useCallback(
    (item: CollaborationItem) => t(`scenes.collaborationAction_${item.actionKey}`),
    [t],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        brandStrip: {
          height: edsPx(spacing['spacing-2']),
          backgroundColor: String(colors.brand),
        },
        sheet: {
          flex: 1,
          borderTopLeftRadius: edsPx(spacing['radius-lg']),
          borderTopRightRadius: edsPx(spacing['radius-lg']),
          backgroundColor: edsPageBackground(colors),
          paddingTop: edsPx(spacing['spacing-4']),
        },
        content: {
          paddingHorizontal: edsSceneContentInset(spacing),
          gap: edsPx(spacing['spacing-5']),
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        titleCluster: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
        },
        countBadge: {
          paddingHorizontal: edsPx(spacing['spacing-2']),
          paddingVertical: edsPx(spacing['spacing-05']),
          borderRadius: edsPx(spacing['radius-sm']),
          backgroundColor: String(colors['material-card-deep']),
        },
        actions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2-5']),
        },
        list: dataListSectionStyle(spacing),
      }),
    [colors, spacing],
  );

  return (
    <View style={styles.root}>
      <View style={styles.brandStrip} />
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: tabBarReserve + edsPx(spacing['spacing-8']),
              paddingTop: edsNavContentGap(spacing),
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={styles.titleCluster}>
              <SceneText variant="title">{t('scenes.collaborationTodoTitle')}</SceneText>
              <View style={styles.countBadge}>
                <SceneText variant="footnotePrimary">{headerBadgeCount}</SceneText>
              </View>
              <EgSymbol
                name="eds-arrow-down-mini-ios"
                size="sm"
                mode={mode}
                strokeColorToken="text-base-secondary"
              />
            </View>
            <View style={styles.actions}>
              <EgButtonGlass
                kind="icon"
                iconCount={1}
                size="md"
                mode={mode}
                icon="eds-search"
                accessibilityLabel={t('scenes.collaborationSearch')}
              />
              <EgButtonGlass
                kind="icon"
                iconCount={1}
                size="md"
                mode={mode}
                icon="eds-more-ios"
                accessibilityLabel={t('scenes.collaborationMore')}
              />
            </View>
          </View>

          <SceneText variant="bodySmallSecondary">
            {t('scenes.collaborationPendingSummary', { count: totalPendingCount })}
          </SceneText>

          <View style={styles.list}>
            {items.map((item) => (
              <CollaborationTodoRow
                key={item.id}
                item={item}
                signKindLabel={signKindLabel(item.signKind)}
                actionLine={actionLine(item)}
                onPress={() =>
                  navigation.navigate('CollaborationDetail', {
                    id: item.id,
                    title: collaborationRowTitle(item),
                  })
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
