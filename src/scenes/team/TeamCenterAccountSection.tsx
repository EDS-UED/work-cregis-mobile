import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterAccountProfileRow } from '@/scenes/team/TeamCenterAccountProfileRow';
import { TeamCenterPlanTierAccountCard } from '@/scenes/team/TeamCenterPlanTierAccountCard';
import {
  TEAM_CENTER_ACCOUNT_ROW_PAD_RIGHT,
  TEAM_CENTER_ACCOUNT_SPLIT_GAP,
  TEAM_CENTER_TEAM_ACCOUNT_PAD_LEFT,
  teamCenterAccountTeamCardShellStyle,
} from '@/scenes/team/teamCenterEgItemLayout';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

/** 团队账户 · 上卡团队信息 + 下卡版本（间距 0 · 共用外轮廓圆角）。 */
export function TeamCenterAccountSection() {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const teamPlanTier = useHomeStore((state) => state.teamPlanTier);
  const showSplitDivider = teamPlanTier === 'basic';
  const [teamCardHeight, setTeamCardHeight] = useState(0);

  const rowPadLeft = edsPx(spacing[TEAM_CENTER_TEAM_ACCOUNT_PAD_LEFT]);
  const rowPadRight = edsPx(spacing[TEAM_CENTER_ACCOUNT_ROW_PAD_RIGHT]);

  const onTeamCardLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTeamCardHeight((prev) => (prev === height ? prev : height));
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stack: {
          gap: TEAM_CENTER_ACCOUNT_SPLIT_GAP,
          position: 'relative',
        },
        dividerOverlay: {
          position: 'absolute',
          left: rowPadLeft,
          right: rowPadRight,
          zIndex: 2,
        },
      }),
    [rowPadLeft, rowPadRight],
  );

  const teamCardStyle = useMemo(
    () =>
      teamCenterAccountTeamCardShellStyle(
        spacing,
        String(colors['material-card-shallow']),
      ),
    [colors, spacing],
  );

  const dividerTop =
    teamCardHeight > 0 ? teamCardHeight - StyleSheet.hairlineWidth : undefined;

  return (
    <View style={styles.stack}>
      <View style={teamCardStyle} onLayout={onTeamCardLayout}>
        <TeamCenterAccountProfileRow isLast />
      </View>
      <TeamCenterPlanTierAccountCard />
      {showSplitDivider && dividerTop != null ? (
        <View style={[styles.dividerOverlay, { top: dividerTop }]} pointerEvents="none">
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </View>
  );
}