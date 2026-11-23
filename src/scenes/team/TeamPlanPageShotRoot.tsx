import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import type { EgEdsAnimaPageShotRootApi } from '@/eds/page-shot';
import { useEgNavBarScroll } from '@/eds/nav-bar';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { TeamPlanPageShotHero } from '@/scenes/team/TeamPlanPageShotHero';
import { TeamSubscriptionPageShotContent } from '@/scenes/team/TeamSubscriptionPageShotContent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCROLL_TOP_EPSILON = 2;
/** 顶缘下拉 · 速度超过阈值即关闭（与 page-shot `pullDown` 互补，防 Scroll 吃手势）。 */
const TOP_PULL_CLOSE_VELOCITY = 120;

type TeamPlanPageShotRootProps = {
  api: EgEdsAnimaPageShotRootApi;
};

/**
 * 套餐 page-shot · 单 ScrollView 同滚。
 * 顶：`bounces` 关 + 下拉 `close`；底：保留回弹。
 */
export function TeamPlanPageShotRoot({ api }: TeamPlanPageShotRootProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const pageWidth = Dimensions.get('window').width;
  const scrollYRef = useRef(0);
  const dragStartYRef = useRef(0);
  const [atScrollTop, setAtScrollTop] = useState(true);
  const { onScroll, scrollEventThrottle } = useEgNavBarScroll({ nativeScrollEdge: false });

  const reportScroll = useCallback(
    (y: number) => {
      onScroll({ nativeEvent: { contentOffset: { y } } });
    },
    [onScroll],
  );

  const syncAtTop = useCallback((y: number) => {
    const next = y <= SCROLL_TOP_EPSILON;
    setAtScrollTop((prev) => (prev === next ? prev : next));
    scrollYRef.current = y;
    reportScroll(y);
  }, [reportScroll]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncAtTop(event.nativeEvent.contentOffset.y);
    },
    [syncAtTop],
  );

  const handleScrollBeginDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragStartYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const tryCloseFromTopPull = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, velocity } = event.nativeEvent;
      if (contentOffset.y > SCROLL_TOP_EPSILON) return;
      if (dragStartYRef.current > SCROLL_TOP_EPSILON) return;
      const vy = velocity?.y ?? 0;
      if (vy >= -TOP_PULL_CLOSE_VELOCITY) return;
      api.close();
    },
    [api],
  );

  const syncScrollSample = useCallback(() => {
    reportScroll(scrollYRef.current);
  }, [reportScroll]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        fill: {
          flex: 1,
          backgroundColor: String(colors['material-card-moderate']),
        },
        body: {
          backgroundColor: String(colors['box-page']),
          paddingBottom: insets.bottom,
        },
      }),
    [colors, insets.bottom],
  );

  return (
    <ScrollView
      style={styles.fill}
      contentInsetAdjustmentBehavior="never"
      bounces={!atScrollTop}
      alwaysBounceVertical={!atScrollTop}
      overScrollMode={atScrollTop && Platform.OS === 'android' ? 'never' : 'always'}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      scrollEventThrottle={scrollEventThrottle}
      onContentSizeChange={syncScrollSample}
      onLayout={() => syncAtTop(0)}
      onScrollEndDrag={(e) => {
        handleScroll(e);
        tryCloseFromTopPull(e);
      }}
      onMomentumScrollEnd={handleScroll}
    >
      <TeamPlanPageShotHero pageWidth={pageWidth} topInset={api.topInset} />
      <View style={styles.body}>
        <TeamSubscriptionPageShotContent />
      </View>
    </ScrollView>
  );
}