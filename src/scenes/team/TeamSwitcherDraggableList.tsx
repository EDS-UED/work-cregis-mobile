import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { TeamSwitcherTeamRow } from '@/scenes/team/TeamSwitcherTeamRow';
import {
  getTeamSwitcherDataListRowLayout,
  teamSwitcherTeamRowHeight,
} from '@/scenes/team/teamSwitcherDataListLayout';
import { edsPx } from '@/utils/edsTheme';
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
const LIFT_SCALE = 1.03;
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

  const [suppressRowPress, setSuppressRowPress] = useState(false);
  const blockRowPressAfterDrag = useRef(false);

  const onSortDragStart = useCallback(() => {
    setSuppressRowPress(true);
  }, []);

  const onSortDragEnd = useCallback((didActivateDrag: boolean) => {
    setSuppressRowPress(false);
    if (didActivateDrag) {
      blockRowPressAfterDrag.current = true;
    }
  }, []);

  const handleSelect = useCallback(() => {
    if (blockRowPressAfterDrag.current) {
      blockRowPressAfterDrag.current = false;
      return;
    }
    onSelect();
  }, [onSelect]);

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
        runOnJS(onSortDragStart)();
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
        const wasActive = active.value;
        if (wasActive) {
          active.value = false;
          const target = teamSwitcherRowOrigin(positions.value[team.id], geometry);
          y.value = withTiming(target.y, SETTLE_TIMING);
          runOnJS(onCommit)(positions.value);
        }
        lift.value = withTiming(0, SETTLE_TIMING);
        runOnJS(onSortDragEnd)(wasActive);
      });
  }, [
    active,
    count,
    geometry,
    lift,
    onCommit,
    onDragLift,
    onDragReorder,
    onSortDragStart,
    onSortDragEnd,
    positions,
    startY,
    team.id,
    y,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: lift.value > 0 ? 10 : 1,
    transform: [
      { translateY: y.value },
      { scale: 1 + (LIFT_SCALE - 1) * lift.value },
    ],
  }));

  const layout = getTeamSwitcherDataListRowLayout(spacing);
  const dragIcon = (
    <EgSymbol
      name="eds-drag-indicator"
      mode={mode}
      size="md"
      strokeColorToken="stroke-base-tertiary"
      accessibilityLabel=""
    />
  );
  const handleTouchWidth =
    edsPx(spacing['symbol-md']) + edsPx(spacing['spacing-2']);
  const handleOverlayLeft = layout.marginH + layout.padH;

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
        onSelect={handleSelect}
        suppressRowPress={suppressRowPress}
        dragHandle={dragIcon}
      />
      {/** 透明手势层盖住拖拽柄 · 不与 DL `Pressable` 抢首触。 */}
      <GestureDetector gesture={pan}>
        <View
          style={{
            position: 'absolute',
            left: handleOverlayLeft,
            top: 0,
            height: geometry.rowHeight,
            width: handleTouchWidth,
            zIndex: 20,
          }}
        />
      </GestureDetector>
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
  const { spacing, typography } = useEdsTheme();
  /** 固定 token 行高 · 避免首帧 onLayout 改 geometry 重建 Pan（首次长按常被掐断）。 */
  const rowHeight = useMemo(
    () => teamSwitcherTeamRowHeight(spacing, typography),
    [spacing, typography],
  );

  const teamIds = useMemo(() => teams.map((team) => team.id), [teams]);
  const positions = useSharedValue<TeamSwitcherPositions>(teamSwitcherToPositions(teamIds));

  useEffect(() => {
    positions.value = teamSwitcherToPositions(teamIds);
  }, [positions, teamIds]);

  const geometry = useMemo<TeamSwitcherListGeometry>(
    () => ({
      rowHeight,
      rowGap,
    }),
    [rowGap, rowHeight],
  );

  const listHeight = useMemo(
    () => teams.length * rowHeight + (teams.length - 1) * rowGap,
    [rowGap, rowHeight, teams.length],
  );

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