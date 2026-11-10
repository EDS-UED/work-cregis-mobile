import { useMemo } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  egNavBarNativeStackOptions,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';
import { useTranslation } from 'react-i18next';

import { useHomeIosNativeHeaderItems } from '@/scenes/home/useHomeIosNativeHeaderItems';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

/**
 * HomeMain — iOS 26+：`egNavBarNativeStackOptions` + 系统栏 `EgButtonGlass host="navigationBar"`；
 * 其它平台：`headerShown: false` + `HomeTopBar` overlay（canvas 原生玻璃 / RN）。
 */
export function useHomeMainScreenOptions(): NativeStackNavigationOptions {
  const { t } = useTranslation();
  const { colors, mode } = useEdsTheme();
  const pageBackground = edsPageBackground(colors);
  const iosHeaderItems = useHomeIosNativeHeaderItems();

  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {
        headerShown: false,
        contentStyle: { backgroundColor: pageBackground },
      };
    }

    const nativeNav = egNavBarNativeStackOptions({
      title: t('tabs.home'),
      showLeft: false,
      showTitle: false,
      showRight: false,
      background: 'auto',
      mode,
    });

    return {
      ...nativeNav,
      ...iosHeaderItems,
      contentStyle: { backgroundColor: pageBackground },
      statusBarTranslucent: true,
      statusBarBackgroundColor: 'transparent',
    };
  }, [iosHeaderItems, mode, pageBackground, t]);
}
