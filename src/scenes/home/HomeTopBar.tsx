import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import {
  EgNavBar,
  egNavBarNativeStackOptions,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
  type EgNavBarScrollOffset,
} from "@eds-evergreen/mobile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useEdsTheme } from "@/hooks/useEdsTheme";
import {
  HomeCompanyName,
  HomeNavBarCompanyItem,
  HomeNavBarMoreUserItem,
  HomeNavLeading,
  HomeNavTrailing,
} from "@/scenes/home/HomeNavBarParts";
import { edsPageBackground, edsPx } from "@/utils/edsTheme";

type HomeTopBarProps = {
  scrollOffset: EgNavBarScrollOffset;
};

/**
 * 主页顶栏（Android / iOS ≤25）— `EgNavBar` 背景 + 绝对定位内容行（`EgButtonGlass`）。
 * iOS 26+ 走系统栏，见 `useHomeNativeHeader`。
 */
export function HomeTopBar({ scrollOffset }: HomeTopBarProps) {
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    shell: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    contentRow: {
      position: "absolute",
      left: 0,
      right: 0,
      top: insets.top,
      zIndex: 20,
      elevation: 20,
      paddingTop: EG_NAV_BAR_PADDING_TOP,
      paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
      paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: edsPx(spacing["spacing-3"]),
    },
  });

  return (
    <View style={styles.shell} pointerEvents="box-none">
      <EgNavBar
        mode={mode}
        title=""
        showTitle={false}
        showLeft={false}
        showRight={false}
        background="auto"
        scrollOffset={scrollOffset}
      />
      <View style={styles.contentRow} pointerEvents="box-none">
        <HomeNavLeading />
        <HomeNavTrailing />
      </View>
    </View>
  );
}

/**
 * iOS 26+ — 与 EDS Showcase 一致：系统 `UINavigationBar`（`egNavBarNativeStackOptions`），栏项玻璃由系统提供。
 * `title` 传真实文案供 VoiceOver；`showTitle: false` 由 EDS 透明隐藏（iOS 26 空标题会使 scroll edge 失效）。
 */
export function useHomeNativeHeaderOptions(): NativeStackNavigationOptions {
  const { t } = useTranslation();
  const { colors, mode } = useEdsTheme();

  return useMemo(() => {
    const {
      headerLeft: _left,
      headerRight: _right,
      ...base
    } = egNavBarNativeStackOptions({
      title: t('tabs.home'),
      showLeft: false,
      showTitle: false,
      showRight: false,
      background: 'auto',
      mode,
    });
    return {
      ...base,
      contentStyle: { backgroundColor: edsPageBackground(colors) },
      statusBarTranslucent: true,
      statusBarBackgroundColor: 'transparent',
      unstable_headerLeftItems: () => [
        { type: 'custom', element: <HomeNavBarCompanyItem /> },
        {
          type: 'custom',
          element: <HomeCompanyName />,
          hidesSharedBackground: true,
        },
      ],
      unstable_headerRightItems: () => [
        { type: 'custom', element: <HomeNavBarMoreUserItem /> },
      ],
    };
  }, [colors, mode, t]);
}

export function homeScrollTopReserve(insetsTop: number, extraBottom: number) {
  return egNavBarScrollContentReserve(insetsTop) + extraBottom;
}
