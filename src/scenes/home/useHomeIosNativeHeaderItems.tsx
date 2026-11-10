import { useMemo } from 'react';
import { View } from 'react-native';
import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  egNavBarNativeStackHeaderGlassItem,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';

import {
  HomeNavCompanyGlassNav,
  HomeNavCompanyNameNav,
  HomeNavNoticeGlassNav,
  HomeNavScanGlassNav,
  HomeNavUserGlassNav,
} from '@/scenes/home/HomeNavBarParts';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

/**
 * iOS 26+ — `unstable_header*Items` + `egNavBarNativeStackHeaderGlassItem` + `EgButtonGlass`。
 * 同侧多颗放进同一个 custom（`hidesSharedBackground`），间距 `spacing-2-5`（与 DS 双胶囊 gap 一致）。
 * 拆成多个栏项时系统还会再插一截栏项间距，胶囊会比设计系统更开。
 */
export function useHomeIosNativeHeaderItems(): Pick<
  NativeStackNavigationOptions,
  'unstable_headerLeftItems' | 'unstable_headerRightItems'
> {
  const { spacing } = useEdsTheme();
  const itemGap = edsPx(spacing['spacing-2-5']);

  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {};
    }

    const row = { flexDirection: 'row' as const, alignItems: 'center' as const, gap: itemGap };

    return {
      unstable_headerLeftItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <View style={row}>
            <HomeNavCompanyGlassNav />
            <HomeNavCompanyNameNav />
          </View>,
        ),
      ],
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <View style={row}>
            <HomeNavScanGlassNav />
            <HomeNavNoticeGlassNav />
            <HomeNavUserGlassNav />
          </View>,
        ),
      ],
    };
  }, [itemGap]);
}
