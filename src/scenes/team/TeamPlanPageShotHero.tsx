import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { CregisTeamLineArt } from '@/scenes/team/CregisTeamLineArt';
import { TeamCenterPlanCardBackdrop } from '@/scenes/team/TeamCenterPlanCardBackdrop';
import { TeamCenterPlanCardSheen } from '@/scenes/team/TeamCenterPlanCardSheen';
import { TeamPlanSubscriptionActions } from '@/scenes/team/TeamPlanSubscriptionActions';
import { TEAM_PLAN_TIER_LABEL_KEY } from '@/scenes/team/teamPlanTier';
import {
  getTeamPlanPageShotHeroBandHeight,
  setTeamPlanPageShotHeroBandHeight,
} from '@/scenes/team/teamPlanCardLayout';
import { useHomeStore } from '@/store';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const TEAM_PLAN_LINE_ASPECT = 152 / 170;

/** 订阅 page-shot 顶区 · 与团队中心卡视觉同源但独立实现，不改动列表卡。 */
export const TeamPlanPageShotHero = memo(function TeamPlanPageShotHero() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const { width: pageWidth } = useWindowDimensions();
  const sceneInset = edsSceneContentInset(spacing);
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);
  const teamPlanTier = useHomeStore((state) => state.teamPlanTier);
  const teamSubscriptionExpires = useHomeStore((state) => state.teamSubscriptionExpires);
  const moderate = String(colors['material-card-moderate']);

  const cachedBandHeight = getTeamPlanPageShotHeroBandHeight();
  const [bandHeight, setBandHeight] = useState(() =>
    cachedBandHeight > 0 ? cachedBandHeight : 0,
  );
  const bandLockedRef = useRef(cachedBandHeight > 0);
  const lineArtWidth = pageWidth > 0 ? pageWidth * 0.5 : 0;
  const lineArtHeight = lineArtWidth > 0 ? lineArtWidth / TEAM_PLAN_LINE_ASPECT : 0;

  const onBandLayout = useCallback((event: LayoutChangeEvent) => {
    if (bandLockedRef.current) return;
    const { height } = event.nativeEvent.layout;
    setTeamPlanPageShotHeroBandHeight(height);
    setBandHeight(height);
    bandLockedRef.current = true;
  }, []);

  const backdropHeight = Math.max(bandHeight, lineArtHeight, cachedBandHeight);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        band: {
          alignSelf: 'stretch',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: moderate,
          borderBottomWidth: 0,
          ...(bandHeight > 0
            ? { minHeight: bandHeight }
            : cachedBandHeight > 0
              ? { minHeight: cachedBandHeight }
              : lineArtHeight > 0
                ? { minHeight: lineArtHeight }
                : null),
        },
        lineArt: {
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          zIndex: 0,
        },
        foreground: {
          zIndex: 1,
          paddingHorizontal: sceneInset,
          paddingBottom: edsPx(spacing['spacing-8']),
        },
        planBody: {
          gap: edsPx(spacing['spacing-6']),
        },
        copy: {
          paddingTop: edsPx(spacing['spacing-14']) + edsPx(spacing['spacing-1']),
          gap: edsPx(spacing['spacing-5']),
        },
        enterpriseRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-1-5']),
        },
        titleBlock: {
          gap: edsPx(spacing['spacing-05']),
        },
      }),
    [bandHeight, cachedBandHeight, lineArtHeight, moderate, sceneInset, spacing],
  );

  return (
    <View style={styles.band} onLayout={onBandLayout}>
      <TeamCenterPlanCardBackdrop
        tier={teamPlanTier}
        width={pageWidth}
        height={backdropHeight}
      />
      <TeamCenterPlanCardSheen
        width={pageWidth}
        height={backdropHeight}
        color={String(colors['material-same-white-weaken'])}
        soft={teamPlanTier !== 'basic'}
        animated={false}
      />
      {lineArtWidth > 0 && teamPlanTier !== 'enterprise' ? (
        <View style={styles.lineArt} pointerEvents="none">
          <CregisTeamLineArt width={lineArtWidth} height={lineArtHeight} strokeColor={moderate} />
        </View>
      ) : null}
      <View style={styles.foreground}>
        <View style={styles.copy}>
          <View style={styles.enterpriseRow}>
            <EgAvatar
              name={activeTeam?.name ?? teamDisplayName}
              size="sm"
              source={activeTeam?.avatarSource}
              colorIndex={activeTeam?.colorIndex}
              accessibilityLabel={teamDisplayName}
            />
            <SceneText
              variant="bodySmallSemibold"
              numberOfLines={1}
              style={{ color: String(colors['text-base-primary']) }}
            >
              {teamDisplayName}
            </SceneText>
          </View>
          <View style={styles.planBody}>
            <View style={styles.titleBlock}>
              <SceneText variant="display">{t(TEAM_PLAN_TIER_LABEL_KEY[teamPlanTier])}</SceneText>
              <SceneText variant="secondary">
                {t('team.subscriptionExpires', { date: teamSubscriptionExpires })}
              </SceneText>
            </View>
            <TeamPlanSubscriptionActions />
          </View>
        </View>
      </View>
    </View>
  );
});