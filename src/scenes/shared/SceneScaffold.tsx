import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { useLayoutEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  EgNavBar,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  egNavBarNativeStackOptions,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@/eds/nav-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useEdsMainScrollLayout } from '@/hooks/useEdsMainScrollLayout';
import { useHideTabBarForInnerPage } from '@/hooks/useHideTabBarForInnerPage';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EdsGlassScreenShell } from '@/scenes/shared/EdsGlassScreenShell';
import { SceneText } from '@/scenes/shared/SceneText';
import {
  edsNavContentGap,
  edsPageBackground,
  edsPageCardBackground,
  edsPx,
  edsSceneContentInset,
} from '@/utils/edsTheme';
import {
  nativeNavScrollSurfaceStyle,
  overlayNavScrollSurfaceStyle,
} from '@/utils/nativeNavScrollSurface';

type SceneScaffoldProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  showNavBack?: boolean;
  /** 设置等分组卡片页 — `box-page-card`。 */
  pageBackground?: 'default' | 'card';
  /** 覆盖内容区左右边距（px）；默认 `edsSceneContentInset`。 */
  contentPaddingHorizontal?: number;
  /** 系统栏 / RN overlay 栏自定义标题（如团队头像 + 下拉）。 */
  customHeaderTitle?: () => ReactElement;
  /** 顶栏主标题（默认展示；团队中心等仅右栏胶囊时可关）。 */
  showNavTitle?: boolean;
  /** overlay 顶栏右侧槽（iOS 26+ 系统栏请走 Stack `screenOptions`）。 */
  overlayNavTrailing?: ReactNode;
  /** 短页滚动闸（与首页 `useEdsMainScrollLayout`）：未溢出隐藏滚动条、不撑 `flexGrow`。 */
  shortPageScrollLayout?: boolean;
}>;

export function SceneScaffold({
  title,
  subtitle,
  showNavBack = false,
  pageBackground = 'default',
  contentPaddingHorizontal,
  customHeaderTitle,
  showNavTitle = true,
  overlayNavTrailing,
  shortPageScrollLayout = false,
  children,
}: SceneScaffoldProps) {
  const { colors, mode, spacing } = useEdsTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll({
    nativeScrollEdge: true,
  });

  useHideTabBarForInnerPage(showNavBack);
  /** RN 栈 / 非原生 Nav — overlay `EgNavBar`；iOS 26+ 由 `EgEdsAnimaPage` 系统栏承担。 */
  const overlayNav = !nativeNavBar;

  const tabBarReserve =
    overlayNav && !showNavBack
      ? egTabBarScrollContentReserveWithSafeArea(insets.bottom)
      : 0;
  /** overlay 内页无 Tab · Android edge-to-edge 须让出系统导航栏，末行才能滚出。 */
  const overlayBottomReserve = showNavBack
    ? insets.bottom + edsSceneContentInset(spacing)
    : tabBarReserve;
  const topReserve = overlayNav ? egNavBarScrollContentReserve(insets.top) : 0;
  const navContentGap = edsNavContentGap(spacing);
  const backLabel = t('common.back');

  const nativeScrollPaddingTop = navContentGap;
  const nativeScrollPaddingBottom = tabBarReserve;
  const overlayScrollPaddingTop = topReserve + navContentGap;
  const overlayScrollPaddingBottom = overlayBottomReserve;

  useLayoutEffect(() => {
    if (nativeNavBar) {
      if (customHeaderTitle) {
        navigation.setOptions({ headerTitle: customHeaderTitle });
        return;
      }
      if (!showNavTitle) {
        const hiddenTitle = egNavBarNativeStackOptions({
          title,
          showTitle: false,
          mode,
        });
        /** 只改标题可见性，勿展开整包 options（会冲掉 `unstable_headerLeftItems` 玻璃返回）。 */
        navigation.setOptions({
          title: hiddenTitle.title,
          headerTitleStyle: hiddenTitle.headerTitleStyle,
        });
        return;
      }
      navigation.setOptions({ title });
      return;
    }
    navigation.setOptions({ headerShown: false, title });
  }, [customHeaderTitle, mode, nativeNavBar, navigation, showNavTitle, title]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1 },
        content: {
          paddingHorizontal:
            contentPaddingHorizontal ?? edsSceneContentInset(spacing),
          paddingBottom: edsSceneContentInset(spacing),
          gap: edsPx(spacing['spacing-3']),
        },
        subtitleBlock: {
          marginBottom: edsPx(spacing['spacing-1']),
        },
        navOverlayShell: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        },
        navBackground: {
          ...StyleSheet.absoluteFill,
          zIndex: 0,
        },
        customTitleRow: {
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 2,
          elevation: 2,
          paddingTop: EG_NAV_BAR_PADDING_TOP,
          paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
          paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'box-none',
        },
        overlayNavTrailing: {
          position: 'absolute',
          right: EG_NAV_BAR_PADDING_HORIZONTAL,
          zIndex: 3,
          elevation: 3,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'box-none',
        },
      }),
    [contentPaddingHorizontal, spacing],
  );

  const pageBg =
    pageBackground === 'card'
      ? edsPageCardBackground(colors)
      : edsPageBackground(colors);
  const pageStyle = [styles.root, { backgroundColor: pageBg }];

  const sceneContentPaddingBottom = edsSceneContentInset(spacing);
  /** Tab 根 / 显式短页走 layout 闸；其余栈内页默认 `flexGrow:1`（减轻 push 首帧）。 */
  const nativeScrollLayoutGate =
    shortPageScrollLayout ||
    (!showNavBack && nativeScrollPaddingBottom > 0);
  const overlayScrollLayoutGate =
    shortPageScrollLayout ||
    (!showNavBack && overlayScrollPaddingBottom > 0);
  const nativeScrollLayout = useEdsMainScrollLayout({
    layoutActive: nativeScrollLayoutGate,
    paddingTop: nativeScrollPaddingTop,
    paddingBottom: nativeScrollPaddingBottom,
    contentExtentBottom: sceneContentPaddingBottom,
  });
  const overlayScrollLayout = useEdsMainScrollLayout({
    layoutActive: overlayScrollLayoutGate,
    paddingTop: overlayScrollPaddingTop,
    paddingBottom: overlayScrollPaddingBottom,
    contentExtentBottom: sceneContentPaddingBottom,
  });

  const body = (
  <>
    {subtitle ? (
      <View style={styles.subtitleBlock}>
        <SceneText variant="footnote">{subtitle}</SceneText>
      </View>
    ) : null}
    {children}
  </>
  );

  if (!overlayNav) {
    /** iOS 26+：ScrollView 须为屏内首子链（对齐 `EgPage` · `useEgNavBarScroll` hidden→soft）。 */
    return (
      <ScrollView
        style={[
          nativeNavScrollSurfaceStyle(colors),
          { flex: 1, backgroundColor: pageBg },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        onLayout={
          nativeScrollLayoutGate
            ? nativeScrollLayout.onViewportLayout
            : undefined
        }
        scrollEnabled={nativeScrollLayout.scrollEnabled}
        showsVerticalScrollIndicator={
          nativeScrollLayoutGate
            ? nativeScrollLayout.showsVerticalScrollIndicator
            : true
        }
        bounces={nativeScrollLayout.bounces}
        alwaysBounceVertical={nativeScrollLayout.alwaysBounceVertical}
        overScrollMode={nativeScrollLayout.overScrollMode}
        contentContainerStyle={[
          styles.content,
          nativeScrollLayoutGate
            ? nativeScrollLayout.contentContainerExtras.flexGrow != null
              ? { flexGrow: nativeScrollLayout.contentContainerExtras.flexGrow }
              : null
            : { flexGrow: 1 },
          { paddingTop: nativeScrollPaddingTop },
          nativeScrollLayoutGate
            ? nativeScrollLayout.contentContainerExtras.paddingBottom != null
              ? { paddingBottom: nativeScrollLayout.contentContainerExtras.paddingBottom }
              : null
            : nativeScrollPaddingBottom > 0
              ? { paddingBottom: nativeScrollPaddingBottom }
              : null,
        ]}
      >
        {nativeScrollLayoutGate ? (
          <View onLayout={nativeScrollLayout.onContentLayout} collapsable={false}>
            {body}
          </View>
        ) : (
          body
        )}
      </ScrollView>
    );
  }

  const navShellHeight = topReserve;

  return (
    <EdsGlassScreenShell
      style={pageStyle}
      overlay={
        <View
          style={[styles.navOverlayShell, { height: navShellHeight }]}
          collapsable={false}
          pointerEvents="box-none"
        >
          <EgNavBar
            chromeContext="overlay"
            mode={mode}
            title={title}
            showTitle={showNavTitle && !customHeaderTitle}
            background="auto"
            showLeft={showNavBack}
            left={
              showNavBack
                ? {
                    kind: 'icon',
                    icon: 'eds-arrow-left-ios',
                    accessibilityLabel: backLabel,
                    onPress: () => navigation.goBack(),
                  }
                : undefined
            }
            scrollOffset={scrollOffset}
            style={styles.navBackground}
          />
          {customHeaderTitle ? (
            <View
              style={[styles.customTitleRow, { top: insets.top, bottom: 0 }]}
              collapsable={false}
              pointerEvents="box-none"
            >
              {customHeaderTitle()}
            </View>
          ) : null}
          {overlayNavTrailing ? (
            <View
              style={[
                styles.overlayNavTrailing,
                {
                  top: insets.top,
                  bottom: 0,
                  paddingTop: EG_NAV_BAR_PADDING_TOP,
                  paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
                },
              ]}
              collapsable={false}
              pointerEvents="box-none"
            >
              {overlayNavTrailing}
            </View>
          ) : null}
        </View>
      }
    >
      {overlayScrollLayoutGate ? (
        <View
          style={{ flex: 1, minHeight: 0 }}
          onLayout={overlayScrollLayout.onViewportLayout}
          collapsable={false}
        >
          <View
            style={[
              { flex: 1, minHeight: 0 },
              overlayScrollLayout.scrollShellInsetStyle,
            ]}
          >
            <ScrollView
              style={overlayNavScrollSurfaceStyle()}
              nestedScrollEnabled
              onScroll={onScroll}
              scrollEventThrottle={scrollEventThrottle}
              scrollEnabled={overlayScrollLayout.scrollEnabled}
              showsVerticalScrollIndicator={
                overlayScrollLayout.showsVerticalScrollIndicator
              }
              bounces={overlayScrollLayout.bounces}
              alwaysBounceVertical={overlayScrollLayout.alwaysBounceVertical}
              overScrollMode={overlayScrollLayout.overScrollMode}
              contentContainerStyle={[
                styles.content,
                overlayScrollLayout.contentContainerExtras.flexGrow != null
                  ? { flexGrow: overlayScrollLayout.contentContainerExtras.flexGrow }
                  : null,
                { paddingTop: overlayScrollPaddingTop },
                overlayScrollLayout.contentContainerExtras.paddingBottom != null
                  ? { paddingBottom: overlayScrollLayout.contentContainerExtras.paddingBottom }
                  : null,
              ]}
            >
              <View
                onLayout={overlayScrollLayout.onContentLayout}
                collapsable={false}
              >
                {body}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, minHeight: 0 }}>
          <ScrollView
            style={overlayNavScrollSurfaceStyle()}
            nestedScrollEnabled
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            bounces
            alwaysBounceVertical
            overScrollMode="always"
            contentContainerStyle={[
              styles.content,
              { flexGrow: 1 },
              { paddingTop: overlayScrollPaddingTop },
              overlayScrollPaddingBottom > 0
                ? { paddingBottom: overlayScrollPaddingBottom }
                : null,
            ]}
          >
            {body}
          </ScrollView>
        </View>
      )}
    </EdsGlassScreenShell>
  );
}