import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgDataListRow } from '@/eds/data-list';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  getTeamSwitcherDataListRowLayout,
  teamSwitcherDataListMediaGap,
} from '@/scenes/team/teamSwitcherDataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import { TEAM_PLAN_TIER_LABEL_KEY, teamPlanTierAccent } from '@/scenes/team/teamPlanTier';
import type { TeamSwitcherItem } from '@/store';
import { edsPx } from '@/utils/edsTheme';

type TeamSwitcherTeamRowProps = {
  team: TeamSwitcherItem;
  selected: boolean;
  onSelect: () => void;
  /** 仅拖拽柄参与排序手势时传入。 */
  dragHandle?: ReactNode;
};

export function TeamSwitcherTeamRow({
  team,
  selected,
  onSelect,
  dragHandle,
}: TeamSwitcherTeamRowProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamSwitcherDataListRowLayout(spacing);
  const tierKey = TEAM_PLAN_TIER_LABEL_KEY[team.planTier];
  const mediaGap = teamSwitcherDataListMediaGap(spacing);
  const tierColor = teamPlanTierAccent(team.planTier, mode);
  const dragAvatarGap = edsPx(spacing['spacing-1']);

  const dragIndicator = dragHandle ?? (
    <EgSymbol
      name="eds-drag-indicator"
      mode={mode}
      size="md"
      strokeColorToken="stroke-base-tertiary"
      accessibilityLabel=""
    />
  );

  return (
    <EgDataListRow
      mode={mode}
      accessibilityLabel={team.name}
      onPress={onSelect}
      axis="row"
      gap={mediaGap}
      layout={layout}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: dragAvatarGap,
        }}
      >
        {dragIndicator}
        <EgAvatar
          name={team.name}
          size="3xl"
          source={team.avatarSource}
          colorIndex={team.colorIndex}
          accessibilityLabel={team.name}
        />
      </View>
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

/** 测量团队行高度 · 与可拖拽列表首帧一致。 */
export function TeamSwitcherTeamRowMeasure({
  team,
  selected,
  onSelect,
  onLayoutHeight,
}: TeamSwitcherTeamRowProps & { onLayoutHeight: (height: number) => void }) {
  return (
    <View
      onLayout={(event) => {
        onLayoutHeight(event.nativeEvent.layout.height);
      }}
    >
      <TeamSwitcherTeamRow team={team} selected={selected} onSelect={onSelect} />
    </View>
  );
}