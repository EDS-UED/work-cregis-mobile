import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgDataList, egDataListRowGap } from '@/eds/data-list';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPageBackground, edsPx } from '@/utils/edsTheme';

/** `page` — `box-page`；`shallow` — `material-card-shallow`。 */
export type TeamCenterMenuCardTone = 'page' | 'shallow';

type TeamCenterMenuSectionCardProps = PropsWithChildren<{
  sectionTitle: string;
  cardTone: TeamCenterMenuCardTone;
}>;

/** 团队中心 · 小标题 + 圆角灰底卡内 `EgDataList` 行。 */
export function TeamCenterMenuSectionCard({
  sectionTitle,
  cardTone,
  children,
}: TeamCenterMenuSectionCardProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing['spacing-2']),
          marginBottom: edsPx(spacing['spacing-4']),
        },
        sectionTitle: {
          marginLeft: edsPx(spacing['spacing-5']),
        },
        card: {
          backgroundColor:
            cardTone === 'page'
              ? edsPageBackground(colors)
              : String(colors['material-card-shallow']),
          borderRadius: edsPx(spacing['radius-lg']),
          overflow: 'hidden',
          padding: edsPx(spacing['spacing-2']),
        },
      }),
    [cardTone, colors, spacing],
  );

  return (
    <View style={styles.section}>
      <SceneText
        variant="bodySmallSemibold"
        style={[styles.sectionTitle, { color: colors['text-base-secondary'] }]}
      >
        {sectionTitle}
      </SceneText>
      <View style={styles.card}>
        <EgDataList sceneContentInset={0} rowGap={egDataListRowGap()}>
          {children}
        </EgDataList>
      </View>
    </View>
  );
}