import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgOptionButton } from '@/eds/scene-buttons';
import { EgSheets, type EgSheetsActionsBlankCompensation } from '@/eds/sheets';
import { EgIconAdd } from '@/eds/team-icons';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataList, EgDataListRow } from '@/eds/data-list';
import {
  getTeamSwitcherDataListRowLayout,
  teamSwitcherCreateRowContentStyle,
  teamSwitcherDataListMediaGap,
} from '@/scenes/team/teamSwitcherDataListLayout';
import { TeamSwitcherDraggableList } from '@/scenes/team/TeamSwitcherDraggableList';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

type TeamSwitcherSheetProps = {
  visible: boolean;
  onDismiss: () => void;
};

function TeamSwitcherCreateRow({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamSwitcherDataListRowLayout(spacing);
  const mediaGap = teamSwitcherDataListMediaGap(spacing);
  const avatarSlot = edsPx(spacing['capsule-md']);
  const addShell = edsPx(spacing['capsule-md']);
  const contentStyle = useMemo(
    () => teamSwitcherCreateRowContentStyle(spacing),
    [spacing],
  );

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
      contentStyle={contentStyle}
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
  const setTeamSwitcherOrder = useHomeStore((state) => state.setTeamSwitcherOrder);
  const listRowGap = edsPx(spacing['spacing-1']);

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

  const handleReorder = useCallback(
    (ordered: typeof teams) => {
      setTeamSwitcherOrder(ordered);
    },
    [setTeamSwitcherOrder],
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
      <EgDataList sceneContentInset={edsSceneContentInset(spacing)} rowGap={listRowGap}>
        <TeamSwitcherDraggableList
          teams={teams}
          activeTeamId={activeTeamId}
          rowGap={listRowGap}
          onSelect={handleSelect}
          onReorder={handleReorder}
        />
        <TeamSwitcherCreateRow onPress={() => undefined} />
      </EgDataList>
    </EgSheets>
  );
}