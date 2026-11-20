import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TeamCenterAccountRowPressable } from '@/scenes/team/TeamCenterAccountRowPressable';
import { TeamCenterAccountRowTrailing } from '@/scenes/team/TeamCenterAccountRowTrailing';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { TeamCenterPlanCardBackdrop } from '@/scenes/team/TeamCenterPlanCardBackdrop';
import { TeamCenterPlanCardSheen } from '@/scenes/team/TeamCenterPlanCardSheen';
import { resolveTeamPlanCardSheenBandLayout } from '@/scenes/team/teamCenterPlanCardLayout';
import {
  TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP,
  TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_LEFT,
  TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_RIGHT,
  TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_V,
  teamCenterAccountPlanTierCardShellStyle,
} from '@/scenes/team/teamCenterEgItemLayout';
import { TeamPlanTierDiamondIcon } from '@/scenes/team/TeamPlanTierDiamondIcon';
import { TEAM_PLAN_TIER_LABEL_KEY, teamPlanTierLabelColor } from '@/scenes/team/teamPlanTier';
import { useHomeStore } from '@/store';
import { useNavigateTeamCenterDetail } from '@/scenes/team/useNavigateTeamCenterDetail';
import { edsPx } from '@/utils/edsTheme';

/** 团队账户 · 下卡版本行 · 壳层静止；点按缩放仅作用于行内内容。 */
export function TeamCenterPlanTierAccountCard() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const teamPlanTier = useHomeStore((state) => state.teamPlanTier);
  const openTeamSubscription = useNavigateTeamCenterDetail();
  const tierLabel = t(TEAM_PLAN_TIER_LABEL_KEY[teamPlanTier]);
  const tierColor = teamPlanTierLabelColor(
    teamPlanTier,
    mode,
    String(colors['text-base-secondary']),
  );
  const symbolPx = edsPx(spacing['symbol-sm']);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const shellStyle = useMemo(
    () =>
      teamCenterAccountPlanTierCardShellStyle(
        spacing,
        String(colors['material-card-moderate']),
      ),
    [colors, spacing],
  );

  const padLeft = edsPx(spacing[TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_LEFT]);
  const padRight = edsPx(spacing[TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_RIGHT]);
  const padV = edsPx(spacing[TEAM_CENTER_PLAN_TIER_ACCOUNT_PAD_V]);
  const iconLabelGap = edsPx(spacing[TEAM_CENTER_EG_ITEM_ICON_LABEL_GAP]);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        rowShell: {
          position: 'relative',
          zIndex: 1,
          alignSelf: 'stretch',
          paddingLeft: padLeft,
          paddingRight: padRight,
          paddingVertical: padV,
        },
        pressBody: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
        },
        iconWrap: {
          marginRight: iconLabelGap,
        },
        labelWrap: {
          flex: 1,
          minWidth: 0,
        },
      }),
    [iconLabelGap, padLeft, padRight, padV],
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const { width, height } = size;
  const showAmbient = width > 0 && height > 0;
  const sheenBandLayout =
    width > 0 && height > 0 ? resolveTeamPlanCardSheenBandLayout(width, height) : undefined;

  return (
    <View style={shellStyle} onLayout={onLayout}>
      {showAmbient ? (
        <>
          <TeamCenterPlanCardBackdrop tier={teamPlanTier} width={width} height={height} />
          <TeamCenterPlanCardSheen
            width={width}
            height={height}
            bandLayout={sheenBandLayout}
            color={String(colors['material-same-white-weaken'])}
            soft={teamPlanTier !== 'basic'}
          />
        </>
      ) : null}
      <View style={styles.rowShell} pointerEvents="box-none">
        <TeamCenterAccountRowPressable
          testID="team-row-view-team-account"
          accessibilityLabel={tierLabel}
          onPress={() => openTeamSubscription('subscription')}
          style={styles.pressBody}
        >
          <View style={styles.iconWrap}>
            <TeamPlanTierDiamondIcon color={tierColor} displayPx={symbolPx} />
          </View>
          <View style={styles.labelWrap}>
            <SceneText variant="bodySemibold" numberOfLines={1} style={{ color: tierColor }}>
              {tierLabel}
            </SceneText>
          </View>
          <TeamCenterAccountRowTrailing mode={mode} />
        </TeamCenterAccountRowPressable>
      </View>
    </View>
  );
}