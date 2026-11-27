import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { LIST_ROW_CHEVRON_STROKE_TOKEN } from '@/scenes/shared/listDisclosureChevron';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';
import { formatMobileDate } from '@/utils/formatMobileDateTime';

import { CregisTeamLineArt } from '@/scenes/team/CregisTeamLineArt';
import { TeamCenterPlanCardBackdrop } from '@/scenes/team/TeamCenterPlanCardBackdrop';
import { TeamCenterPlanCardSheen } from '@/scenes/team/TeamCenterPlanCardSheen';
import { TEAM_PLAN_TIER_LABEL_KEY } from '@/scenes/team/teamPlanTier';
import { useTeamPlanPageShotCovering } from '@/scenes/team/teamPlanPageShotCovering';

/** 稿面 viewBox 152×170 · 高度铺满卡片，宽度按比例向左延伸。 */
const TEAM_PLAN_LINE_ASPECT = 152 / 170;

export function useTeamCenterPlanCardShellStyle() {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: String(colors['material-card-moderate']),
          borderRadius: edsPx(spacing['radius-md']),
          paddingTop: edsPx(spacing['spacing-6']),
          paddingBottom: edsPx(spacing['spacing-6']),
          paddingHorizontal: edsPx(spacing['spacing-6']),
          overflow: 'hidden',
        },
      }),
    [colors, spacing],
  );
}

type TeamCenterPlanCardContentProps = {
  width: number;
  height: number;
  showAccountLink?: boolean;
  /** 线稿祖先 `transform.scale` · page-shot 飞行稿逆补偿描边。 */
  lineArtLayoutScale?: number;
};

/** 团队中心列表 · 套餐卡正文（扫光 / 线稿 / 文案）。 */
export function TeamCenterPlanCardContent({
  width,
  height,
  showAccountLink = true,
  lineArtLayoutScale = 1,
}: TeamCenterPlanCardContentProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing, typography } = useEdsTheme();
  const accountLinkLineHeight = edsPx(typography['line-height-body-small']);
  const teamPlanTier = useHomeStore((state) => state.teamPlanTier);
  const teamSubscriptionExpires = useHomeStore((state) => state.teamSubscriptionExpires);
  const pageShotCovering = useTeamPlanPageShotCovering((state) => state.active);
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
          zIndex: 2,
          alignSelf: 'stretch',
        },
        titleBlock: {
          gap: edsPx(spacing['spacing-05']),
          marginBottom: showAccountLink ? edsPx(spacing['spacing-7']) : 0,
        },
        accountLink: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: edsPx(spacing['spacing-0']),
        },
        accountLinkIconSlot: {
          height: accountLinkLineHeight,
          justifyContent: 'center',
          alignItems: 'center',
        },
        accountLinkIconNudge: {
          marginTop: -edsPx(spacing['spacing-05']),
        },
      }),
    [accountLinkLineHeight, showAccountLink, spacing],
  );

  return (
    <>
      <TeamCenterPlanCardBackdrop tier={teamPlanTier} width={width} height={height} />
      <TeamCenterPlanCardSheen
        width={width}
        height={height}
        color={String(colors['material-same-white-weaken'])}
        soft={teamPlanTier !== 'basic'}
        animated={!pageShotCovering}
      />
      <View style={styles.lineArt} pointerEvents="none">
        {lineArtWidth > 0 && teamPlanTier !== 'enterprise' ? (
          <CregisTeamLineArt
            width={lineArtWidth}
            height={lineArtHeight}
            strokeColor={String(colors['material-card-moderate'])}
            layoutScale={lineArtLayoutScale}
          />
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <SceneText variant="headline">{t(TEAM_PLAN_TIER_LABEL_KEY[teamPlanTier])}</SceneText>
          <SceneText variant="bodyMedium">
            {t('team.subscriptionExpires', {
              date: formatMobileDate(teamSubscriptionExpires),
            })}
          </SceneText>
        </View>
        {showAccountLink ? (
          <View style={styles.accountLink} pointerEvents="none" importantForAccessibility="no-hide-descendants">
            <SceneText variant="bodySmallStrong">{t('team.viewTeamAccountShort')}</SceneText>
            <View style={[styles.accountLinkIconSlot, styles.accountLinkIconNudge]}>
              <EgSymbol
                name="eds-arrow-right-mini-ios"
                mode={mode}
                size="xs"
                strokeColorToken={LIST_ROW_CHEVRON_STROKE_TOKEN}
                accessibilityLabel=""
              />
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}