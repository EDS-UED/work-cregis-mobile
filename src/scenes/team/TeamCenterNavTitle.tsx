import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import { MotionPressable } from '@/eds/team-icons';
import { HOME_COMPANY_NAME_MAX_WIDTH } from '@/scenes/home/HomeNavBarParts';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

const TEAM_NAV_CHEVRON_PX = 12;

type TeamCenterNavTitleProps = {
  onOpenSwitcher: () => void;
};

/** 系统 Nav 标题：团队头像 sm + 名称（同首页公司名）+ 下拉箭头 · 点开切换 Sheets。 */
export function TeamCenterNavTitle({ onOpenSwitcher }: TeamCenterNavTitleProps) {
  const { t } = useTranslation();
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

  return (
    <MotionPressable
      accessibilityRole="button"
      accessibilityLabel={t('team.openSwitcher', { name: teamDisplayName })}
      onPress={onOpenSwitcher}
      style={({ pressed }: { pressed: boolean }) => [
        styles.hit,
        pressed ? styles.pressed : null,
      ]}
    >
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
            <SceneText
              variant="bodySemibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {teamDisplayName}
            </SceneText>
          </View>
          <View style={styles.chevronSlot}>
            <EgSymbol
              name="eds-arrow-down-ios"
              mode={mode}
              displayPx={TEAM_NAV_CHEVRON_PX}
              strokeColorToken="text-base-secondary"
              accessibilityLabel=""
            />
          </View>
        </View>
      </View>
    </MotionPressable>
  );
}
