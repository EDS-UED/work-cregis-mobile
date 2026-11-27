import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgOptionButton } from '@/eds/scene-buttons';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDividerEnd } from '@/scenes/shared/EgDividerEnd';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

/** 团队信息 · 头像 / 商户号 / 尾分线 / 退出登录。 */
export function TeamInfoDetailContent() {
  const { t } = useTranslation();
  const { mode, spacing, colors } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const teamId = useHomeStore((state) => state.teamId);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);
  const inset = edsSceneContentInset(spacing);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          paddingHorizontal: inset,
          paddingTop: edsPx(spacing['spacing-6']),
          justifyContent: 'space-between',
          paddingBottom: edsPx(spacing['spacing-8']),
        },
        profile: {
          alignItems: 'center',
          gap: edsPx(spacing['spacing-3']),
        },
        merchantRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-1']),
        },
        divider: {
          alignSelf: 'stretch',
          marginTop: edsPx(spacing['spacing-8']),
        },
        logout: {
          alignSelf: 'stretch',
        },
      }),
    [inset, spacing],
  );

  return (
    <View style={styles.root}>
      <View>
        <View style={styles.profile}>
          <EgAvatar
            name={activeTeam?.name ?? teamDisplayName}
            size="4xl"
            source={activeTeam?.avatarSource}
            colorIndex={activeTeam?.colorIndex}
            accessibilityLabel={teamDisplayName}
          />
          <SceneText variant="display" style={{ textAlign: 'center' }}>
            {teamDisplayName}
          </SceneText>
          <View style={styles.merchantRow}>
            <SceneText variant="bodySmallSecondary">
              {t('team.merchantNoLine', { id: teamId })}
            </SceneText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('team.copyTeamId')}
              hitSlop={8}
              onPress={() => undefined}
            >
              <EgSymbol
                name="eds-copy"
                mode={mode}
                size="sm"
                strokeColorToken="stroke-base-tertiary"
                accessibilityLabel=""
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.divider}>
          <EgDividerEnd />
        </View>
      </View>
      <EgOptionButton
        label={t('team.signOut')}
        mode={mode}
        size="lg"
        figmaType="secondary"
        onPress={() => undefined}
        style={{
          ...styles.logout,
          backgroundColor: String(colors['material-card-deep']),
        }}
      />
    </View>
  );
}