import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDecorButton, EgOptionButton } from '@/eds/scene-buttons';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

import { CregisTeamLineArt } from '@/scenes/team/CregisTeamLineArt';
import { TeamCenterPlanCardBackdrop } from '@/scenes/team/TeamCenterPlanCardBackdrop';
import { TeamCenterPlanCardSheen } from '@/scenes/team/TeamCenterPlanCardSheen';
import { TEAM_PLAN_TIER_LABEL_KEY } from '@/scenes/team/teamPlanTier';
export function useTeamCenterPlanCardShellStyle() {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: String(colors['material-card-moderate']),
          borderRadius: edsPx(spacing['radius-lg']),
          paddingTop: edsPx(spacing['spacing-5']),
          paddingBottom: edsPx(spacing['spacing-6']),
          paddingHorizontal: edsPx(spacing['spacing-6']),
          overflow: 'hidden',
        },
      }),
    [colors, spacing],
  );
}

/** 稿面 viewBox 152×170 · 高度铺满容器，宽度按比例向左延伸。 */
const TEAM_PLAN_LINE_VIEW_WIDTH = 152;
const TEAM_PLAN_LINE_VIEW_HEIGHT = 170;
const TEAM_PLAN_LINE_ASPECT =
  TEAM_PLAN_LINE_VIEW_WIDTH / TEAM_PLAN_LINE_VIEW_HEIGHT;

/** 套餐卡正文 · 扫光 / 线稿 / 文案 / 按钮。 */
export function TeamCenterPlanCardContent({ width, height }: { width: number; height: number }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const teamPlanTier = useHomeStore((state) => state.teamPlanTier);
  const teamSubscriptionExpires = useHomeStore((state) => state.teamSubscriptionExpires);
  const lineArtHeight = height;
  const lineArtWidth = lineArtHeight > 0 ? lineArtHeight * TEAM_PLAN_LINE_ASPECT : 0;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        lineArt: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'flex-end',
          zIndex: 0,
        },
        body: {
          position: 'relative',
          zIndex: 1,
          alignSelf: 'stretch',
        },
        titleBlock: {
          gap: edsPx(spacing['spacing-1-5']),
          marginBottom: edsPx(spacing['spacing-7']),
        },
        expiresLabel: {
          color: colors['text-base-tertiary'],
        },
        actions: {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          gap: edsPx(spacing['spacing-2-5']),
        },
      }),
    [colors, spacing],
  );

  return (
    <>
      <TeamCenterPlanCardBackdrop tier={teamPlanTier} width={width} height={height} />
      <TeamCenterPlanCardSheen
        width={width}
        height={height}
        color={String(colors['material-same-white-weaken'])}
        soft={teamPlanTier !== 'basic'}
      />
      <View style={styles.lineArt} pointerEvents="none">
        {lineArtWidth > 0 && teamPlanTier !== 'enterprise' ? (
          <CregisTeamLineArt
            width={lineArtWidth}
            height={lineArtHeight}
            strokeColor={String(colors['material-card-moderate'])}
          />
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <SceneText variant="headline">{t(TEAM_PLAN_TIER_LABEL_KEY[teamPlanTier])}</SceneText>
          <SceneText variant="bodyMediumStrong" style={styles.expiresLabel}>
            {t('team.subscriptionExpires', { date: teamSubscriptionExpires })}
          </SceneText>
        </View>
        <View style={styles.actions}>
          <EgDecorButton
            label={t('team.upgrade')}
            mode={mode}
            size="sm"
            onPress={() => undefined}
          />
          <EgOptionButton
            label={t('team.renewFee')}
            mode={mode}
            size="sm"
            onPress={() => undefined}
          />
        </View>
      </View>
    </>
  );
}
