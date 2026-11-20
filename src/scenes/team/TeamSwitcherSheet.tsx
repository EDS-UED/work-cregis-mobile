import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgOptionButton } from '@/eds/scene-buttons';
import { EgSheets, type EgSheetsActionsBlankCompensation } from '@/eds/sheets';
import { EgSymbol } from '@/eds/home-ui';
import { EgIconAdd } from '@/eds/team-icons';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataList, EgDataListRow } from '@/eds/data-list';
import {
  getTeamSwitcherDataListRowLayout,
  teamSwitcherDataListMediaGap,
} from '@/scenes/team/teamSwitcherDataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { TEAM_PLAN_TIER_LABEL_KEY, teamPlanTierAccent } from '@/scenes/team/teamPlanTier';
import { useHomeStore, type TeamSwitcherItem } from '@/store';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamSwitcherSheetProps = {
  visible: boolean;
  onDismiss: () => void;
};

function TeamSwitcherRow({
  team,
  selected,
  onSelect,
}: {
  team: TeamSwitcherItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamSwitcherDataListRowLayout(spacing);
  const tierKey = TEAM_PLAN_TIER_LABEL_KEY[team.planTier];
  const mediaGap = teamSwitcherDataListMediaGap(spacing);
  const tierColor = teamPlanTierAccent(team.planTier, mode);

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={team.name}
      onPress={onSelect}
      axis="row"
      gap={mediaGap}
      layout={layout}
    >
      <EgAvatar
        name={team.name}
        size="3xl"
        source={team.avatarSource}
        colorIndex={team.colorIndex}
        accessibilityLabel={team.name}
      />
      <View
        style={{
          flex: 1,
          minWidth: 0,
          gap: edsPx(spacing['spacing-05']),
        }}
      >
        <SceneText variant="bodySemibold" numberOfLines={2}>
          {team.name}
        </SceneText>
        <SceneText
          variant="bodySmallSecondary"
          numberOfLines={1}
          style={tierColor ? { color: tierColor } : undefined}
        >
          {t(tierKey)}
        </SceneText>
      </View>
      {selected ? (
        <EgSymbol
          name="eds-enable-fill"
          mode={mode}
          displayPx={edsPx(spacing['symbol-md'])}
          strokeColorToken="material-decor"
          accessibilityLabel=""
        />
      ) : null}
    </EgDataListRow>
  );
}

function TeamSwitcherCreateRow({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamSwitcherDataListRowLayout(spacing);
  const mediaGap = teamSwitcherDataListMediaGap(spacing);
  const avatarSlot = edsPx(spacing['capsule-md']);
  const addShell = edsPx(spacing['capsule-md']);

  const addIconShellStyle = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          width: addShell,
          height: addShell,
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: String(colors['material-card-deep']),
        },
        slot: {
          width: avatarSlot,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [addShell, avatarSlot, colors, spacing],
  );

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={t('team.switcherCreateTeam')}
      onPress={onPress}
      axis="row"
      gap={mediaGap}
      layout={layout}
    >
      <View style={addIconShellStyle.slot}>
        <View style={addIconShellStyle.shell}>
          <EgIconAdd mode={mode} size="md" accessibilityLabel="" />
        </View>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <SceneText variant="bodySemibold" numberOfLines={1}>
          {t('team.switcherCreateTeam')}
        </SceneText>
      </View>
    </EgDataListRow>
  );
}

/** 团队切换 · EgSheets 默认 adaptive · 可拉到 large · 列表 DL · Web3 走 action 插槽。 */
export function TeamSwitcherSheet({ visible, onDismiss }: TeamSwitcherSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const teams = useHomeStore((state) => state.teams);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const setActiveTeam = useHomeStore((state) => state.setActiveTeam);

  const sheetActionStyles = useMemo(
    () =>
      StyleSheet.create({
        block: {
          gap: edsPx(spacing['spacing-3']),
          alignSelf: 'stretch',
          width: '100%',
        },
        /** Option · Fill 宽（与 DS `buttonShowcaseWidthStyle('fill')` / Sheets `defaultAction` 一致）。 */
        optionFill: {
          alignSelf: 'stretch',
          width: '100%',
        },
        caption: {
          textAlign: 'center',
        },
      }),
    [spacing],
  );

  const sheetActions = useMemo(
    () => (
      <View style={sheetActionStyles.block}>
        <EgOptionButton
          label={t('team.web3Wallet')}
          mode={mode}
          size="lg"
          figmaType="primary"
          onPress={() => undefined}
          style={sheetActionStyles.optionFill}
        />
        <SceneText variant="bodySmallSecondary" style={sheetActionStyles.caption}>
          {t('team.web3WalletCaption')}
        </SceneText>
      </View>
    ),
    [mode, sheetActionStyles, t],
  );

  const handleSelect = useCallback(
    (teamId: string) => {
      setActiveTeam(teamId);
      onDismiss();
    },
    [onDismiss, setActiveTeam],
  );

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      detents={['adaptive', 'large']}
      initialDetent="adaptive"
      title={t('team.switcherTitle')}
      showTitle
      showRight
      dismissible
      showActions
      actions={sheetActions}
      actionsBlankCompensation={'spacing-14' as EgSheetsActionsBlankCompensation}
    >
      <EgDataList
        sceneContentInset={edsSceneContentInset(spacing)}
        rowGap={edsPx(spacing['spacing-1'])}
      >
        {teams.map((team) => (
          <TeamSwitcherRow
            key={team.id}
            team={team}
            selected={team.id === activeTeamId}
            onSelect={() => handleSelect(team.id)}
          />
        ))}
        <TeamSwitcherCreateRow onPress={() => undefined} />
      </EgDataList>
    </EgSheets>
  );
}
