import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  followSlideIndicatorX,
  snapSlideIndicatorX,
  useEgSlideSegmentIndicator,
} from '@/shims/eds-mobile-slide-track';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import type { HomeTodoFilter } from '@/store';
import { edsPx } from '@/utils/edsTheme';

const SWIPE_COMMIT_DISTANCE = 48;
/** 列表切换须晚于 `spring.slide-commit` 落位（~280ms），否则长列表挂载会抢占 UI 线程造成指示器掉帧。 */
const LIST_COMMIT_DELAY_MS = 280;
/** 胶囊左右内边距 — `spacing-3`（12px · `var(--spacing-3)`）。 */
const CHIP_PADDING_HORIZONTAL = 'spacing-3' as const;
/** 胶囊间距 — `spacing-1`（4px · `var(--spacing-1)`）。 */
const CHIP_GAP = 'spacing-1' as const;

type TodoFilterChipProps = {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

function formatFilterBadge(count: number) {
  if (count >= 100) {
    return '99+';
  }
  return String(count);
}

type TodoFilterChipTheme = {
  chipPaddingHorizontal: number;
  chipPaddingVertical: number;
  chipGap: number;
  chipRadius: number;
  hideBackground: string;
  primaryColor: string;
  secondaryColor: string;
  countColor: string;
};

const TodoFilterChip = memo(function TodoFilterChip({
  label,
  count,
  selected,
  onPress,
  theme,
}: TodoFilterChipProps & { theme: TodoFilterChipTheme }) {
  const badgeLabel = formatFilterBadge(count);
  const {
    chipPaddingHorizontal,
    chipPaddingVertical,
    chipGap,
    primaryColor,
    secondaryColor,
    countColor,
  } = theme;
  const showCount = count > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={showCount ? `${label} ${badgeLabel}` : label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexGrow: 0,
        flexShrink: 0,
        gap: chipGap,
        paddingHorizontal: chipPaddingHorizontal,
        paddingVertical: chipPaddingVertical,
        borderRadius: theme.chipRadius,
        backgroundColor: selected ? 'transparent' : theme.hideBackground,
        overflow: 'visible',
      }}
    >
      <SceneText
        variant="bodySmallMedium"
        style={{
          color: selected ? primaryColor : secondaryColor,
        }}
      >
        {label}
      </SceneText>
      {showCount ? (
        <SceneText variant="bodySmallMedium" style={{ color: countColor }}>
          {badgeLabel}
        </SceneText>
      ) : null}
    </Pressable>
  );
});

export type HomeTodoFilterOption = {
  id: HomeTodoFilter;
  label: string;
  count: number;
};

type HomeTodoFilterBarProps = {
  options: HomeTodoFilterOption[];
  selectedId: HomeTodoFilter;
  onSelect: (id: HomeTodoFilter) => void;
};

/** 待办筛选胶囊 — EDS `useEgSlideSegmentIndicator` + `followSlideIndicatorX`（语义 slide）。 */
export function HomeTodoFilterBar({
  options,
  selectedId,
  onSelect,
}: HomeTodoFilterBarProps) {
  const { colors, spacing } = useEdsTheme();
  const chipGap = edsPx(spacing[CHIP_GAP]);
  const chipRadius = edsPx(spacing['radius-full']);
  const chipTheme = useMemo<TodoFilterChipTheme>(
    () => ({
      chipPaddingHorizontal: edsPx(spacing[CHIP_PADDING_HORIZONTAL]),
      chipPaddingVertical: edsPx(spacing['spacing-2']),
      chipGap: edsPx(spacing['spacing-1-5']),
      chipRadius,
      hideBackground: String(colors['material-hide']),
      primaryColor: String(colors['text-base-primary']),
      secondaryColor: String(colors['text-base-secondary']),
      countColor: String(colors['status-danger']),
    }),
    [chipRadius, colors, spacing],
  );
  const measuredLayoutsRef = useRef<Record<number, { x: number; width: number }>>({});
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const propIndex = useMemo(() => {
    const index = options.findIndex((o) => o.id === selectedId);
    return index >= 0 ? index : 0;
  }, [options, selectedId]);
  const [selectedIndex, setSelectedIndex] = useState(propIndex);

  useEffect(() => {
    if (commitTimerRef.current == null) {
      setSelectedIndex(propIndex);
    }
  }, [propIndex]);

  useEffect(
    () => () => {
      if (commitTimerRef.current != null) {
        clearTimeout(commitTimerRef.current);
      }
    },
    [],
  );

  const {
    indicatorStyle,
    onSegmentLayout,
    indicatorX,
    indicatorWidth,
    layoutsShared,
  } = useEgSlideSegmentIndicator(options.length, selectedIndex);

  const selectIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) {
        return;
      }
      setSelectedIndex(index);
      if (commitTimerRef.current != null) {
        clearTimeout(commitTimerRef.current);
      }
      commitTimerRef.current = setTimeout(() => {
        commitTimerRef.current = null;
        if (option.id !== selectedId) {
          onSelect(option.id);
        }
      }, LIST_COMMIT_DELAY_MS);
    },
    [onSelect, options, selectedId],
  );

  const onTabPress = useCallback(
    (index: number) => {
      if (index === selectedIndex) {
        return;
      }
      selectIndex(index);
    },
    [selectIndex, selectedIndex],
  );

  const reportSegmentLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      const prev = measuredLayoutsRef.current[index];
      if (prev && prev.x === x && prev.width === width) {
        return;
      }
      measuredLayoutsRef.current[index] = { x, width };
      onSegmentLayout(index)(event);
    },
    [onSegmentLayout],
  );

  const finalizePan = useCallback(
    (translationX: number, pointerX: number) => {
      const layouts = layoutsShared.value;
      let index = selectedIndex;
      if (layouts.length > 0) {
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        for (let i = 0; i < layouts.length; i += 1) {
          const layout = layouts[i];
          if (!layout) continue;
          const center = layout.x + layout.width / 2;
          const dist = Math.abs(pointerX - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        index = best;
      }
      if (Math.abs(translationX) >= SWIPE_COMMIT_DISTANCE) {
        if (translationX < 0 && index < options.length - 1) {
          index += 1;
        } else if (translationX > 0 && index > 0) {
          index -= 1;
        }
      }
      if (index === selectedIndex) {
        snapSlideIndicatorX(index, layoutsShared.value, indicatorX, indicatorWidth, true);
        return;
      }
      selectIndex(index);
    },
    [indicatorWidth, indicatorX, layoutsShared, options.length, selectIndex, selectedIndex],
  );

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-16, 16])
        .failOffsetY([-24, 24])
        .onUpdate((event) => {
          'worklet';
          followSlideIndicatorX(event.x, layoutsShared.value, indicatorX, indicatorWidth);
        })
        .onEnd((event) => {
          'worklet';
          scheduleOnRN(finalizePan, event.translationX, event.x);
        }),
    [finalizePan, indicatorWidth, indicatorX, layoutsShared],
  );

  return (
    <GestureDetector gesture={swipeGesture}>
      <View accessibilityRole="tablist" style={{ alignSelf: 'stretch' }}>
        <View
          collapsable={false}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: chipGap,
            position: 'relative',
          }}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                borderRadius: chipRadius,
                backgroundColor: String(colors['event-focus']),
                zIndex: 0,
              },
              indicatorStyle,
            ]}
          />
          {options.map((option, index) => (
            <View
              key={option.id}
              style={{ zIndex: 1, alignSelf: 'flex-start' }}
              onLayout={reportSegmentLayout(index)}
            >
              <TodoFilterChip
                label={option.label}
                count={option.count}
                selected={index === selectedIndex}
                theme={chipTheme}
                onPress={() => onTabPress(index)}
              />
            </View>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
