import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgAvatar } from '@/eds/button-glass';
import { EgDivider } from '@/eds/team-icons';
import { TeamCenterAccountRowPressable } from '@/scenes/team/TeamCenterAccountRowPressable';
import { TeamCenterAccountRowTrailing } from '@/scenes/team/TeamCenterAccountRowTrailing';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import {
  TEAM_CENTER_ACCOUNT_AVATAR_TEXT_GAP,
  TEAM_CENTER_ACCOUNT_ROW_PAD_RIGHT,
  TEAM_CENTER_TEAM_ACCOUNT_PAD_LEFT,
  TEAM_CENTER_TEAM_ACCOUNT_PAD_V,
} from '@/scenes/team/teamCenterEgItemLayout';
import { useHomeStore } from '@/store';
import { useNavigateTeamCenterDetail } from '@/scenes/team/useNavigateTeamCenterDetail';
import { edsPx } from '@/utils/edsTheme';
import { useTranslation } from 'react-i18next';

type TeamCenterAccountProfileRowProps = {
  isLast?: boolean;
};

/** 团队账户组 · 头像 + 名称 / ID（对齐 `PersonalCenterAccountProfileRow`）。 */
export function TeamCenterAccountProfileRow({
  isLast = false,
}: TeamCenterAccountProfileRowProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const teamId = useHomeStore((state) => state.teamId);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);
  const openTeamManagement = useNavigateTeamCenterDetail();

  const rowPaddingLeft = edsPx(spacing[TEAM_CENTER_TEAM_ACCOUNT_PAD_LEFT]);
  const rowPaddingRight = edsPx(spacing[TEAM_CENTER_ACCOUNT_ROW_PAD_RIGHT]);
  const rowPaddingV = edsPx(spacing[TEAM_CENTER_TEAM_ACCOUNT_PAD_V]);
  const mediaGap = edsPx(spacing[TEAM_CENTER_ACCOUNT_AVATAR_TEXT_GAP]);
  const titleSubGap = edsPx(spacing['spacing-05']);
  const dividerMarginTop = edsPx(spacing['spacing-1']);
  const dividerMarginBottom = edsPx(spacing['spacing-1']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        rowShell: {
          alignSelf: 'stretch',
          paddingLeft: rowPaddingLeft,
          paddingRight: rowPaddingRight,
          paddingVertical: rowPaddingV,
        },
        pressBody: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
        },
        avatarSlot: {
          marginRight: mediaGap,
        },
        textCol: {
          flex: 1,
          minWidth: 0,
          gap: titleSubGap,
        },
        dividerWrap: {
          paddingLeft: rowPaddingLeft,
          paddingRight: rowPaddingRight,
          marginTop: dividerMarginTop,
          marginBottom: dividerMarginBottom,
        },
      }),
    [
      dividerMarginBottom,
      dividerMarginTop,
      mediaGap,
      rowPaddingLeft,
      rowPaddingRight,
      rowPaddingV,
      titleSubGap,
    ],
  );

  return (
    <>
      <View style={styles.rowShell}>
        <TeamCenterAccountRowPressable
          testID="team-center-account-profile"
          accessibilityLabel={teamDisplayName}
          onPress={() => openTeamManagement('management')}
          style={styles.pressBody}
        >
          <View style={styles.avatarSlot}>
            <EgAvatar
              name={activeTeam?.name ?? teamDisplayName}
              size="5xl"
              source={activeTeam?.avatarSource}
              colorIndex={activeTeam?.colorIndex}
              accessibilityLabel={teamDisplayName}
            />
          </View>
          <View style={styles.textCol}>
            <SceneText variant="title" numberOfLines={1}>
              {teamDisplayName}
            </SceneText>
            <SceneText variant="bodySmallSecondary" numberOfLines={1}>
              {t('team.teamIdLine', { id: teamId })}
            </SceneText>
          </View>
          <TeamCenterAccountRowTrailing mode={mode} />
        </TeamCenterAccountRowPressable>
      </View>
      {!isLast ? (
        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} />
        </View>
      ) : null}
    </>
  );
}