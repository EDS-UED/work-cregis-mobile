import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgAvatar } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { MotionPressable } from '@/eds/team-icons';
import { HOME_COMPANY_NAME_MAX_WIDTH } from '@/scenes/home/HomeNavBarParts';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

/** 团队切换 / 套餐卡链式箭头 · 与 `eds-arrow-*-ios` displayPx 一致。 */
export const TEAM_NAV_CHEVRON_PX = 12;

type TeamNavTitleRowProps = {
  /** 展示下拉箭头（团队中心切换入口）。 */
  showChevron?: boolean;
  /** 可点按 · 须配合 `onPress`。 */
  interactive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 团队 Nav 标题行：头像 sm + 名称（可选下拉 · 可选点按）。 */
export function TeamNavTitleRow({
  showChevron = false,
  interactive = false,
  onPress,
  accessibilityLabel,
}: TeamNavTitleRowProps) {
  const { mode, spacing } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hit: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
          paddingHorizontal: edsPx(spacing['spacing-2']),
          paddingVertical: edsPx(spacing['spacing-1']),
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
          flexShrink: 1,
          minWidth: 0,
        },
        nameWrap: {
          maxWidth: HOME_COMPANY_NAME_MAX_WIDTH,
          flexShrink: 1,
          minWidth: 0,
        },
        nameChevron: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-1']),
          flexShrink: 1,
          minWidth: 0,
        },
        chevronSlot: {
          width: TEAM_NAV_CHEVRON_PX,
          height: TEAM_NAV_CHEVRON_PX,
          alignItems: 'center',
          justifyContent: 'center',
        },
        pressed: { opacity: 0.88 },
      }),
    [spacing],
  );

  const inner = (
    <View style={styles.row}>
      <EgAvatar
        name={activeTeam?.name ?? teamDisplayName}
        size="sm"
        source={activeTeam?.avatarSource}
        colorIndex={activeTeam?.colorIndex}
        accessibilityLabel={teamDisplayName}
      />
      <View style={styles.nameChevron}>
        <View style={styles.nameWrap}>
          <SceneText variant="bodySemibold" numberOfLines={1} ellipsizeMode="tail">
            {teamDisplayName}
          </SceneText>
        </View>
        {showChevron ? (
          <View style={styles.chevronSlot}>
            <EgSymbol
              name="eds-arrow-down-ios"
              mode={mode}
              displayPx={TEAM_NAV_CHEVRON_PX}
              strokeColorToken="text-base-secondary"
              accessibilityLabel=""
            />
          </View>
        ) : null}
      </View>
    </View>
  );

  if (interactive && onPress != null) {
    return (
      <MotionPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }: { pressed: boolean }) => [styles.hit, pressed ? styles.pressed : null]}
      >
        {inner}
      </MotionPressable>
    );
  }

  return <View style={styles.hit}>{inner}</View>;
}