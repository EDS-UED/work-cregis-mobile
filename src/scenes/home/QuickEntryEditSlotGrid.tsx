import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useTeamCenterPlanCardShellStyle } from '@/scenes/team/TeamCenterPlanCardContent';
import {
  DEFAULT_QUICK_ENTRY_IDS,
  HOME_QUICK_ENTRY_MAX,
  resolveQuickService,
  type QuickServiceId,
} from '@/scenes/home/homeQuickServicesCatalog';
import { QuickServiceHomeIcon } from '@/scenes/home/homeQuickServiceIcons';
import { QuickServiceActionBadge } from '@/scenes/home/quickServiceBadges';
import { SceneText } from '@/scenes/shared/SceneText';
import { useEdsTapPressMotion } from '@/utils/edsMotion';
import { edsPx } from '@/utils/edsTheme';
import mobileTheme from '@/eds/tokens';

/** 与首页快捷入口 · `scale-press-down-xs` 一致。 */
const RESET_PRESS_SCALE =
  (mobileTheme.motion.scale['scale-press-down-xs'] as number) ?? 0.96;

function pressScaleSlack(layoutPx: number, activeScale: number) {
  return Math.max(
    1,
    Math.ceil((layoutPx * Math.abs(activeScale - 1)) / 2) + 1,
  );
}

const GRID_COLUMNS = 4;
const GRID_ROWS = 2;
const RESET_SLOT_INDEX = GRID_COLUMNS * GRID_ROWS - 1;
const LONG_PRESS_MS = 260;
const LIFT_SCALE = 1.03;
/** 拖出网格的最大越界 · 占列宽 / 行距比例 */
const DRAG_OVERSHOOT_RATIO = 0.3;
const SETTLE_TIMING = { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) };
const LIFT_TIMING = { duration: 160, easing: Easing.out(Easing.quad) };

type Positions = Record<string, number>;

type GridGeometry = {
  columnWidth: number;
  rowHeight: number;
  rowGap: number;
};

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function slotOrigin(index: number, geometry: GridGeometry) {
  'worklet';
  return {
    x: (index % GRID_COLUMNS) * geometry.columnWidth,
    y: Math.floor(index / GRID_COLUMNS) * (geometry.rowHeight + geometry.rowGap),
  };
}

function hoveredSlot(x: number, y: number, geometry: GridGeometry, count: number) {
  'worklet';
  const rowStride = geometry.rowHeight + geometry.rowGap;
  const col = clamp(
    Math.floor((x + geometry.columnWidth / 2) / geometry.columnWidth),
    0,
    GRID_COLUMNS - 1,
  );
  const row = clamp(Math.floor((y + rowStride / 2) / rowStride), 0, GRID_ROWS - 1);
  return Math.min(count - 1, row * GRID_COLUMNS + col);
}

function movePosition(positions: Positions, id: string, to: number): Positions {
  'worklet';
  const from = positions[id];
  const next: Positions = {};
  for (const key in positions) {
    const p = positions[key];
    if (key === id) {
      next[key] = to;
    } else if (from < to && p > from && p <= to) {
      next[key] = p - 1;
    } else if (to < from && p >= to && p < from) {
      next[key] = p + 1;
    } else {
      next[key] = p;
    }
  }
  return next;
}

function toPositions(ids: QuickServiceId[]): Positions {
  const map: Positions = {};
  ids.forEach((id, index) => {
    map[id] = index;
  });
  return map;
}

function orderFromPositions(positions: Positions): QuickServiceId[] {
  return (Object.keys(positions) as QuickServiceId[]).sort(
    (a, b) => positions[a] - positions[b],
  );
}

type ResetSlotButtonProps = {
  outlineCapsuleStyle: ViewStyle;
  tilePadding: number;
  mode: ReturnType<typeof useEdsTheme>['mode'];
  accessibilityLabel: string;
  onPress: () => void;
};

function ResetSlotButton({
  outlineCapsuleStyle,
  tilePadding,
  mode,
  accessibilityLabel,
  onPress,
}: ResetSlotButtonProps) {
  const { colors } = useEdsTheme();
  const { animatedStyle, onPressIn, onPressOut, pressing } = useEdsTapPressMotion('xs');
  const tileSize =
    typeof outlineCapsuleStyle.width === 'number' ? outlineCapsuleStyle.width : 0;
  const pressSlack = pressScaleSlack(tileSize, RESET_PRESS_SCALE);

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        width: tileSize,
        alignItems: 'center',
        overflow: 'visible',
        zIndex: pressing ? 1 : 0,
      }}
    >
      <View style={{ paddingTop: pressSlack, overflow: 'visible' }}>
        <Animated.View
          style={[
            outlineCapsuleStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
              padding: tilePadding,
              backgroundColor: pressing
                ? String(colors['event-tap'])
                : 'transparent',
            },
            animatedStyle,
          ]}
        >
          <EgSymbol
            name="eds-reset"
            mode={mode}
            size="md"
            strokeColorToken="stroke-base-secondary"
            accessibilityLabel=""
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}

type DraggableToolProps = {
  id: QuickServiceId;
  initialIndex: number;
  count: number;
  positions: SharedValue<Positions>;
  geometry: GridGeometry;
  tileSize: number;
  tilePadding: number;
  labelGap: number;
  mode: ReturnType<typeof useEdsTheme>['mode'];
  onRemove: (id: QuickServiceId) => void;
  onCommit: (positions: Positions) => void;
  canRemove: boolean;
};

function DraggableTool({
  id,
  initialIndex,
  count,
  positions,
  geometry,
  tileSize,
  tilePadding,
  labelGap,
  mode,
  onRemove,
  onCommit,
  canRemove,
}: DraggableToolProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useEdsTheme();
  const service = resolveQuickService(id);
  const badgeSize = edsPx(spacing['spacing-5']);

  const initialOrigin = slotOrigin(initialIndex, geometry);
  const x = useSharedValue(initialOrigin.x);
  const y = useSharedValue(initialOrigin.y);
  const active = useSharedValue(false);
  const lift = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useAnimatedReaction(
    () => positions.value[id],
    (next, prev) => {
      if (next === undefined || active.value) return;
      const target = slotOrigin(next, geometry);
      if (prev == null) {
        x.value = target.x;
        y.value = target.y;
        return;
      }
      if (next !== prev) {
        x.value = withTiming(target.x, SETTLE_TIMING);
        y.value = withTiming(target.y, SETTLE_TIMING);
      }
    },
    [geometry, id],
  );

  const pan = useMemo(() => {
    const rowStride = geometry.rowHeight + geometry.rowGap;
    const minX = -geometry.columnWidth * DRAG_OVERSHOOT_RATIO;
    const maxX = geometry.columnWidth * (GRID_COLUMNS - 1 + DRAG_OVERSHOOT_RATIO);
    const minY = -rowStride * DRAG_OVERSHOOT_RATIO;
    const maxY = rowStride * (GRID_ROWS - 1 + DRAG_OVERSHOOT_RATIO);

    return Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_MS)
      .onStart(() => {
        active.value = true;
        startX.value = x.value;
        startY.value = y.value;
        lift.value = withTiming(1, LIFT_TIMING);
      })
      .onUpdate((event) => {
        x.value = clamp(startX.value + event.translationX, minX, maxX);
        y.value = clamp(startY.value + event.translationY, minY, maxY);
        const to = hoveredSlot(x.value, y.value, geometry, count);
        if (to !== positions.value[id]) {
          positions.value = movePosition(positions.value, id, to);
        }
      })
      .onFinalize(() => {
        if (!active.value) return;
        active.value = false;
        const target = slotOrigin(positions.value[id], geometry);
        x.value = withTiming(target.x, SETTLE_TIMING);
        y.value = withTiming(target.y, SETTLE_TIMING);
        lift.value = withTiming(0, SETTLE_TIMING);
        runOnJS(onCommit)(positions.value);
      });
  }, [active, count, geometry, id, lift, onCommit, positions, startX, startY, x, y]);

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: lift.value > 0 ? 10 : 1,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: 1 + (LIFT_SCALE - 1) * lift.value },
    ],
  }));

  if (!service) return null;

  const label = t(service.labelKey);

  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(120)}
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          width: geometry.columnWidth,
          alignItems: 'center',
        },
        animatedStyle,
      ]}
    >
      <GestureDetector gesture={pan}>
        <View style={{ alignItems: 'center', alignSelf: 'stretch' }}>
          <View style={{ width: tileSize, height: tileSize }}>
            <View
              style={{
                width: tileSize,
                height: tileSize,
                borderRadius: edsPx(spacing['radius-full']),
                backgroundColor: String(colors['material-card-deep']),
                alignItems: 'center',
                justifyContent: 'center',
                padding: tilePadding,
              }}
            >
              <QuickServiceHomeIcon id={service.id} icon={service.icon} mode={mode} />
            </View>
            <QuickServiceActionBadge
              kind="remove"
              mode={mode}
              size={badgeSize}
              onPress={canRemove ? () => onRemove(id) : undefined}
              accessibilityLabel={label}
            />
          </View>
          <SceneText
            variant="footnotePrimary"
            numberOfLines={1}
            style={{ marginTop: labelGap, textAlign: 'center', alignSelf: 'stretch' }}
          >
            {label}
          </SceneText>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

type QuickEntryEditSlotGridProps = {
  entryIds: QuickServiceId[];
  onChange: (ids: QuickServiceId[]) => void;
  onRemove: (id: QuickServiceId) => void;
};

/** 编辑态 · 8 格（7 工具 + 重置）· 长按拖拽实时排序，位移与换位全部在 UI 线程计算。 */
export function QuickEntryEditSlotGrid({
  entryIds,
  onChange,
  onRemove,
}: QuickEntryEditSlotGridProps) {
  const { t } = useTranslation();
  const { mode, colors, spacing, typography } = useEdsTheme();
  const shell = useTeamCenterPlanCardShellStyle();
  const [gridWidth, setGridWidth] = useState(0);

  const tileSize = edsPx(spacing['capsule-xl']);
  const tilePadding = edsPx(spacing['spacing-4']);
  const labelGap = edsPx(spacing['spacing-2']);
  const gridColGutter = edsPx(spacing['spacing-4']) / 2;
  const sectionGap = edsPx(spacing['spacing-6']);
  const labelLineHeight = edsPx(typography['line-height-footnote']);
  const rowHeight = tileSize + labelGap + labelLineHeight;

  const geometry = useMemo<GridGeometry>(
    () => ({
      columnWidth: gridWidth / GRID_COLUMNS,
      rowHeight,
      rowGap: sectionGap,
    }),
    [gridWidth, rowHeight, sectionGap],
  );

  const gridContentHeight = useMemo(() => {
    let total = 0;
    for (let row = 0; row < GRID_ROWS; row += 1) {
      let rowMax = 0;
      for (let col = 0; col < GRID_COLUMNS; col += 1) {
        const index = row * GRID_COLUMNS + col;
        const cellHeight = index < entryIds.length ? rowHeight : tileSize;
        rowMax = Math.max(rowMax, cellHeight);
      }
      total += rowMax;
      if (row < GRID_ROWS - 1) {
        total += sectionGap;
      }
    }
    return total;
  }, [entryIds.length, rowHeight, sectionGap, tileSize]);

  const positions = useSharedValue<Positions>(toPositions(entryIds));

  useEffect(() => {
    positions.value = toPositions(entryIds);
  }, [entryIds, positions]);

  const onCommit = useCallback(
    (next: Positions) => {
      const ordered = orderFromPositions(next);
      if (ordered.some((id, index) => id !== entryIds[index])) {
        onChange(ordered);
      }
    },
    [entryIds, onChange],
  );

  const outlineCapsuleStyle = useMemo(
    () => ({
      width: tileSize,
      height: tileSize,
      borderRadius: edsPx(spacing['radius-full']),
      borderWidth: edsPx(spacing['stroke-sm']),
      borderColor: String(colors['stroke-divider-shallow']),
      backgroundColor: 'transparent' as const,
    }),
    [colors, spacing, tileSize],
  );

  const placeholderIndexes = useMemo(() => {
    const list: number[] = [];
    for (let index = entryIds.length; index < HOME_QUICK_ENTRY_MAX; index += 1) {
      list.push(index);
    }
    return list;
  }, [entryIds.length]);

  const cellStyle = (index: number): ViewStyle => {
    const origin = slotOrigin(index, geometry);
    return {
      position: 'absolute',
      left: origin.x,
      top: origin.y,
      width: geometry.columnWidth,
      alignItems: 'center',
    };
  };

  return (
    <View
      style={[
        shell.card,
        {
          gap: sectionGap,
          alignSelf: 'stretch',
          paddingBottom: edsPx(spacing['spacing-8']),
        },
      ]}
    >
      <SceneText variant="bodySmallMedium" style={{ color: colors['text-base-tertiary'] }}>
        {t('home.quickServiceEditHint')}
      </SceneText>
      <View
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        style={{
          marginHorizontal: -gridColGutter,
          height: gridWidth > 0 ? gridContentHeight : undefined,
          minHeight: gridWidth > 0 ? undefined : rowHeight + sectionGap + tileSize,
        }}
      >
        {gridWidth > 0 ? (
          <>
            {placeholderIndexes.map((index) => (
              <View key={`empty-${index}`} style={cellStyle(index)}>
                <View style={outlineCapsuleStyle} />
              </View>
            ))}
            <View style={cellStyle(RESET_SLOT_INDEX)}>
              <ResetSlotButton
                outlineCapsuleStyle={outlineCapsuleStyle}
                tilePadding={tilePadding}
                mode={mode}
                accessibilityLabel={t('home.quickServiceReset')}
                onPress={() => onChange([...DEFAULT_QUICK_ENTRY_IDS])}
              />
            </View>
            {entryIds.map((id, index) => (
              <DraggableTool
                key={id}
                id={id}
                initialIndex={index}
                count={entryIds.length}
                positions={positions}
                geometry={geometry}
                tileSize={tileSize}
                tilePadding={tilePadding}
                labelGap={labelGap}
                mode={mode}
                onRemove={onRemove}
                onCommit={onCommit}
                canRemove={entryIds.length > 1}
              />
            ))}
          </>
        ) : null}
      </View>
    </View>
  );
}
