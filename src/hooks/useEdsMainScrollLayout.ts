import { useCallback, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';

type UseEdsMainScrollLayoutOptions = {
  /** 失焦屏不量 layout — 避免 push 时与下层页抢 JS（`enableFreeze` 补充保险）。 */
  layoutActive?: boolean;
  paddingTop: number;
  /** Tab 底距等 · 溢出时进 `contentContainer`；未溢出时用滚动壳 `paddingBottom` 腾出 Tab，不算进可滚高度。 */
  paddingBottom: number;
  /** 始终在 `contentContainer` 内的底距（如场景 inset），算进可滚高度判定。 */
  contentExtentBottom?: number;
  hysteresisPx?: number;
};

const DEFAULT_HYSTERESIS_PX = 24;

/**
 * 主 ScrollView 布局闸：未溢出时不撑 `flexGrow`、不把 Tab 底距算进 contentSize（无假溢出 · 无滚动条）。
 * 手势保持系统橡皮筋：`scrollEnabled` + `bounces` / `alwaysBounceVertical` 常开。
 * 溢出时恢复 `flexGrow:1` + 底距在 Scroll 内（与 Showcase / EgPage 长页一致）。
 * **视口 `onLayout` 须挂外层 `flex:1` 壳**（勿挂 ScrollView；Tab 底距外置会改变 Scroll 量高 → §12 点按反馈环）。
 */
export function useEdsMainScrollLayout({
  layoutActive,
  paddingTop,
  paddingBottom,
  contentExtentBottom = 0,
  hysteresisPx = DEFAULT_HYSTERESIS_PX,
}: UseEdsMainScrollLayoutOptions) {
  const isFocused = useIsFocused();
  const measureLayout = layoutActive ?? isFocused;
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const overflowsRef = useRef(false);

  const contentOverflows = useMemo(() => {
    if (viewportHeight <= 0 || contentHeight <= 0) {
      return false;
    }
    const bottomInContent = overflowsRef.current ? paddingBottom : 0;
    const total =
      contentHeight + paddingTop + contentExtentBottom + bottomInContent;
    const enterThreshold = viewportHeight + hysteresisPx;
    const exitThreshold = viewportHeight - hysteresisPx;
    const threshold = overflowsRef.current ? exitThreshold : enterThreshold;
    const next = total > threshold;
    overflowsRef.current = next;
    return next;
  }, [
    contentExtentBottom,
    contentHeight,
    hysteresisPx,
    paddingBottom,
    paddingTop,
    viewportHeight,
  ]);

  const onViewportLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!measureLayout) return;
      const height = Math.round(event.nativeEvent.layout.height);
      setViewportHeight((prev) => (prev === height ? prev : height));
    },
    [measureLayout],
  );

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!measureLayout) return;
      const height = Math.round(event.nativeEvent.layout.height);
      setContentHeight((prev) => (prev === height ? prev : height));
    },
    [measureLayout],
  );

  const reserveTabOutside = paddingBottom > 0 && !contentOverflows;

  const scrollShellInsetStyle = useMemo((): ViewStyle | null => {
    if (!reserveTabOutside) {
      return null;
    }
    return { paddingBottom: paddingBottom };
  }, [paddingBottom, reserveTabOutside]);

  return {
    contentOverflows,
    scrollEnabled: true as const,
    showsVerticalScrollIndicator: contentOverflows,
    bounces: true as const,
    alwaysBounceVertical: true as const,
    overScrollMode: 'always' as const,
    onViewportLayout,
    onContentLayout,
    scrollShellInsetStyle,
    contentContainerExtras: {
      flexGrow: contentOverflows ? (1 as const) : undefined,
      paddingBottom: contentOverflows && paddingBottom > 0 ? paddingBottom : undefined,
    },
  };
}