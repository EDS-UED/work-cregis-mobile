import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { EgEdsAnimaPageShotRootApi } from '@/eds/page-shot';
import { useEgNavBarScroll } from '@/eds/nav-bar';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsNavContentGap, edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamPlanPageShotRootProps = {
  api: EgEdsAnimaPageShotRootApi;
};

/** 套餐 page-shot 根页 · 顶栏「订阅」· 占位（结构同 DS `PageStackDemoPage` · `showHeader={false}`）。 */
export function TeamPlanPageShotRoot({ api }: TeamPlanPageShotRootProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const { onScroll, scrollEventThrottle } = useEgNavBarScroll();
  const navGap = edsNavContentGap(spacing);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        fill: { flex: 1 },
        content: {
          paddingHorizontal: edsSceneContentInset(spacing),
          paddingBottom: edsPx(spacing['spacing-8']),
        },
        placeholder: {
          textAlign: 'center',
        },
      }),
    [spacing],
  );

  return (
    <ScrollView
      style={styles.fill}
      contentInsetAdjustmentBehavior={api.contentInsetAdjustmentBehavior}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={[styles.content, { paddingTop: api.scrollTopInset + navGap }]}
    >
      <SceneText variant="bodySmallSecondary" style={styles.placeholder}>
        {t('team.subscriptionComingSoon')}
      </SceneText>
    </ScrollView>
  );
}
