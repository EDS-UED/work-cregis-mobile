import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgDataList } from '@/eds/data-list';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPageBackground, edsPx } from '@/utils/edsTheme';

/** `page` — `box-page`；`shallow` — `material-card-shallow`（对齐个人中心 `EgItemGroup`）。 */
export type CompareTeamCenterMenuCardTone = 'page' | 'shallow';

const PERSONAL_CENTER_SECTION_TONE: Record<
  CompareTeamCenterMenuCardTone,
  boolean
> = {
  page: true,
  shallow: true,
};

type CompareTeamCenterMenuSectionCardProps = PropsWithChildren<{
  sectionTitle: string;
  cardTone: CompareTeamCenterMenuCardTone;
}>;

/** 对比 · 团队中心菜单分块 — 小标题 + 圆角卡片内 `EgDataList`。 */
export function CompareTeamCenterMenuSectionCard({
  sectionTitle,
  cardTone,
  children,
}: CompareTeamCenterMenuSectionCardProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing['spacing-2']),
          ...(PERSONAL_CENTER_SECTION_TONE[cardTone]
            ? { marginBottom: edsPx(spacing['spacing-4']) }
            : null),
        },
        sectionTitle: {
          marginLeft: edsPx(
            spacing[
              PERSONAL_CENTER_SECTION_TONE[cardTone] ? 'spacing-5' : 'spacing-2'
            ],
          ),
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
        <EgDataList sceneContentInset={0} rowGap={edsPx(spacing['spacing-0'])}>
          {children}
        </EgDataList>
      </View>
    </View>
  );
}