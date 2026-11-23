import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  TeamSwitcherTeamRow,
  TeamSwitcherTeamRowMeasure,
} from '@/scenes/team/TeamSwitcherTeamRow';
import type { TeamSwitcherItem } from '@/store';
import {
  edsHapticDragReorderLift,
  edsHapticDragReorderSelection,
} from '@/utils/edsHaptics';

import {
  clamp,
  hoveredTeamSwitcherIndex,
  moveTeamSwitcherPosition,
  teamSwitcherOrderFromPositions,
  teamSwitcherRowOrigin,
  teamSwitcherToPositions,
  type TeamSwitcherListGeometry,
  type TeamSwitcherPositions,
} from './teamSwitcherReorderWorklets';

const LONG_PRESS_MS = 260;
const LIFT_SCALE = 1.02;
const DRAG_OVERSHOOT_RATIO = 0.35;
const SETTLE_TIMING = { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) };
const LIFT_TIMING = { duration: 160, easing: Easing.out(Easing.quad) };

type DraggableTeamRowProps = {
  team: TeamSwitcherItem;
  selected: boolean;
  initialIndex: number;
  count: number;
  geometry: TeamSwitcherListGeometry;
  positions: SharedValue<TeamSwitcherPositions>;
  onSelect: () => void;
  onCommit: (next: TeamSwitcherPositions) => void;
};

function DraggableTeamSwitcherRow({
  team,
  selected,
  initialIndex,
  count,
  geometry,
  positions,
  onSelect,
  onCommit,
}: DraggableTeamRowProps) {
  const { mode, spacing } = useEdsTheme();
  const initialOrigin = teamSwitcherRowOrigin(initialIndex, geometry);
  const y = useSharedValue(initialOrigin.y);
  const active = useSharedValue(false);
  const lift = useSharedValue(0);
  const startY = useSharedValue(0);

  const onDragLift = useCallback(() => {
    edsHapticDragReorderLift();
  }, []);

  const onDragReorder = useCallback(() => {
    edsHapticDragReorderSelection();
  }, []);

  useAnimatedReaction(
    () => positions.value[team.id],
    (next, prev) => {
      if (next === undefined || active.value) return;
      const target = teamSwitcherRowOrigin(next, geometry);
      if (prev == null) {
        y.value = target.y;
        return;
      }
      if (next !== prev) {
        y.value = withTiming(target.y, SETTLE_TIMING);
      }
    },
    [geometry, team.id],
  );

  const pan = useMemo(() => {
    const rowStride = geometry.rowHeight + geometry.rowGap;
    const minY = -rowStride * DRAG_OVERSHOOT_RATIO;
    const maxY = rowStride * (count - 1 + DRAG_OVERSHOOT_RATIO);

    return Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_MS)
      .onStart(() => {
        active.value = true;
        startY.value = y.value;
        lift.value = withTiming(1, LIFT_TIMING);
        runOnJS(onDragLift)();
      })
      .onUpdate((event) => {
        y.value = clamp(startY.value + event.translationY, minY, maxY);
        const to = hoveredTeamSwitcherIndex(y.value, geometry, count);
        if (to !== positions.value[team.id]) {
          positions.value = moveTeamSwitcherPosition(positions.value, team.id, to);
          runOnJS(onDragReorder)();
        }
      })
      .onFinalize(() => {
        if (!active.value) return;
        active.value = false;
        const target = teamSwitcherRowOrigin(positions.value[team.id], geometry);
        y.value = withTiming(target.y, SETTLE_TIMING);
        lift.value = withTiming(0, SETTLE_TIMING);
        runOnJS(onCommit)(positions.value);
      });
  }, [active, count, geometry, lift, onCommit, onDragLift, onDragReorder, positions, startY, team.id, y]);

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: lift.value > 0 ? 10 : 1,
    transform: [
      { translateY: y.value },
      { scale: 1 + (LIFT_SCALE - 1) * lift.value },
    ],
  }));

  const dragHandle = (
    <GestureDetector gesture={pan}>
      <View>
        <EgSymbol
          name="eds-drag-indicator"
          mode={mode}
          size="md"
          strokeColorToken="stroke-base-tertiary"
          accessibilityLabel=""
        />
      </View>
    </GestureDetector>
  );

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: geometry.rowHeight,
        },
        animatedStyle,
      ]}
    >
      <TeamSwitcherTeamRow
        team={team}
        selected={selected}
        onSelect={onSelect}
        dragHandle={dragHandle}
      />
    </Animated.View>
  );
}

type TeamSwitcherDraggableListProps = {
  teams: TeamSwitcherItem[];
  activeTeamId: string;
  rowGap: number;
  onSelect: (teamId: string) => void;
  onReorder: (teams: TeamSwitcherItem[]) => void;
};

/** 团队切换列表 · 长按拖拽柄排序（与首页快捷入口编辑同类手势）。 */
export function TeamSwitcherDraggableList({
  teams,
  activeTeamId,
  rowGap,
  onSelect,
  onReorder,
}: TeamSwitcherDraggableListProps) {
  const [rowHeight, setRowHeight] = useState(0);
  const teamIds = useMemo(() => teams.map((team) => team.id), [teams]);
  const positions = useSharedValue<TeamSwitcherPositions>(teamSwitcherToPositions(teamIds));

  useEffect(() => {
    positions.value = teamSwitcherToPositions(teamIds);
  }, [positions, teamIds]);

  const onMeasureHeight = useCallback((height: number) => {
    setRowHeight((prev) => Math.max(prev, height));
  }, []);

  const geometry = useMemo<TeamSwitcherListGeometry>(
    () => ({
      rowHeight,
      rowGap,
    }),
    [rowGap, rowHeight],
  );

  const listHeight = useMemo(() => {
    if (rowHeight <= 0 || teams.length === 0) return undefined;
    return teams.length * rowHeight + (teams.length - 1) * rowGap;
  }, [rowGap, rowHeight, teams.length]);

  const onCommit = useCallback(
    (next: TeamSwitcherPositions) => {
      const orderedIds = teamSwitcherOrderFromPositions(next);
      if (orderedIds.some((id, index) => id !== teamIds[index])) {
        const byId = new Map(teams.map((item) => [item.id, item]));
        const ordered = orderedIds
          .map((id) => byId.get(id))
          .filter((item): item is TeamSwitcherItem => item != null);
        if (ordered.length === teams.length) {
          onReorder(ordered);
        }
      }
    },
    [onReorder, teamIds, teams],
  );

  if (rowHeight === 0) {
    return (
      <>
        {teams.map((team) => (
          <TeamSwitcherTeamRowMeasure
            key={team.id}
            team={team}
            selected={team.id === activeTeamId}
            onSelect={() => onSelect(team.id)}
            onLayoutHeight={onMeasureHeight}
          />
        ))}
      </>
    );
  }

  return (
    <View
      style={{
        height: listHeight,
        alignSelf: 'stretch',
      }}
    >
      {teams.map((team, index) => (
        <DraggableTeamSwitcherRow
          key={team.id}
          team={team}
          selected={team.id === activeTeamId}
          initialIndex={index}
          count={teams.length}
          geometry={geometry}
          positions={positions}
          onSelect={() => onSelect(team.id)}
          onCommit={onCommit}
        />
      ))}
    </View>
  );
}