import type { PropsWithChildren, ReactElement } from 'react';
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
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@/eds/nav-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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
}>;

export function SceneScaffold({
  title,
  subtitle,
  showNavBack = false,
  pageBackground = 'default',
  contentPaddingHorizontal,
  customHeaderTitle,
  children,
}: SceneScaffoldProps) {
  const { colors, mode, spacing } = useEdsTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();

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

  useLayoutEffect(() => {
    if (nativeNavBar) {
      navigation.setOptions(
        customHeaderTitle ? { headerTitle: customHeaderTitle } : { title },
      );
      return;
    }
    navigation.setOptions({ headerShown: false, title });
  }, [customHeaderTitle, nativeNavBar, navigation, title]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1 },
        content: {
          flexGrow: 1,
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
      }),
    [contentPaddingHorizontal, spacing],
  );

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

  const pageBg =
    pageBackground === 'card'
      ? edsPageCardBackground(colors)
      : edsPageBackground(colors);
  const pageStyle = [styles.root, { backgroundColor: pageBg }];

  if (!overlayNav) {
    return (
      <ScrollView
        style={[nativeNavScrollSurfaceStyle(colors), { backgroundColor: pageBg }]}
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: navContentGap, paddingBottom: tabBarReserve },
        ]}
      >
        {body}
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
            showTitle={!customHeaderTitle}
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
        </View>
      }
    >
      <ScrollView
        style={overlayNavScrollSurfaceStyle()}
        nestedScrollEnabled
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topReserve + navContentGap,
            paddingBottom: overlayBottomReserve,
          },
        ]}
      >
        {body}
      </ScrollView>
    </EdsGlassScreenShell>
  );
}
