import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { TeamInfoTeamIdCopySymbolAction } from '@/scenes/team/detail/TeamInfoTeamIdCopySymbolAction';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDividerEnd } from '@/scenes/shared/EgDividerEnd';
import { SceneText } from '@/scenes/shared/SceneText';
import { teamInfoDividerScreenInset } from '@/scenes/team/detail/teamInfoActionsLayout';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

/** 稿面头像 96。Avatar 族最大档 `avatar-5xl`，不足部分按比例放大。 */
const TEAM_INFO_AVATAR_PX = 96;

/** 复制成功 · `eds-enable-fill` 展示时长。 */
const TEAM_INFO_COPY_SUCCESS_MS = 2000;

/** 团队信息 · 头像 / 名称 / 团队编号 / 尾分线（底栏见 `TeamInfoDetailActions`）。 */
export function TeamInfoDetailContent() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const [teamIdCopied, setTeamIdCopied] = useState(false);
  const copySuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const teamId = useHomeStore((state) => state.teamId);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);
  const dividerInsetX = teamInfoDividerScreenInset(spacing);
  const avatarBase = edsPx(spacing['avatar-5xl']);
  const avatarScale = TEAM_INFO_AVATAR_PX / avatarBase;
  const gapNavBlock = edsPx(spacing['spacing-4']);
  const gapTitleSub = edsPx(spacing['spacing-1']);
  const gapSubDivider = edsPx(spacing['spacing-8']);

  const onCopyTeamId = useCallback(() => {
    if (teamIdCopied) {
      return;
    }
    if (copySuccessTimerRef.current != null) {
      clearTimeout(copySuccessTimerRef.current);
    }
    setTeamIdCopied(true);
    copySuccessTimerRef.current = setTimeout(() => {
      setTeamIdCopied(false);
      copySuccessTimerRef.current = null;
    }, TEAM_INFO_COPY_SUCCESS_MS);
  }, [teamIdCopied]);

  useEffect(
    () => () => {
      if (copySuccessTimerRef.current != null) {
        clearTimeout(copySuccessTimerRef.current);
      }
    },
    [],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flexGrow: 1,
        },
        header: {
          alignItems: 'center',
        },
        avatarSlot: {
          width: TEAM_INFO_AVATAR_PX,
          height: TEAM_INFO_AVATAR_PX,
          alignItems: 'center',
          justifyContent: 'center',
        },
        title: {
          marginTop: gapNavBlock,
          textAlign: 'center',
        },
        teamNoRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: gapTitleSub,
          gap: edsPx(spacing['spacing-05']),
        },
        divider: {
          alignSelf: 'stretch',
          marginTop: gapSubDivider,
          paddingHorizontal: dividerInsetX,
        },
      }),
    [dividerInsetX, gapNavBlock, gapSubDivider, gapTitleSub, spacing],
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.avatarSlot}>
          <EgAvatar
            name={activeTeam?.name ?? teamDisplayName}
            size="5xl"
            source={activeTeam?.avatarSource}
            colorIndex={activeTeam?.colorIndex}
            accessibilityLabel={teamDisplayName}
            style={{ transform: [{ scale: avatarScale }] }}
          />
        </View>
        <SceneText variant="headline" style={styles.title}>
          {teamDisplayName}
        </SceneText>
        <View style={styles.teamNoRow}>
          <SceneText variant="secondary">
            {t('team.teamNoLine', { id: teamId })}
          </SceneText>
          <TeamInfoTeamIdCopySymbolAction
            mode={mode}
            copied={teamIdCopied}
            onPress={onCopyTeamId}
            accessibilityLabel={t('team.copyTeamId')}
          />
        </View>
        <View style={styles.divider}>
          <EgDividerEnd />
        </View>
      </View>
    </View>
  );
}