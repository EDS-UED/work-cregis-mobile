import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { egNavBarNativeStackOptions } from '@/eds/nav-bar';
import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageRootScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { edsPageBackground } from '@/utils/edsTheme';

import { useHomeIosNativeHeaderItems } from '@/scenes/home/useHomeIosNativeHeaderItems';

/**
 * HomeMain — iOS 26+ 系统 Nav + scroll edge；其余 `headerShown: false` + `HomeTopBar` overlay。
 */
export function useHomeMainScreenOptions(): StackNavigationOptions {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);
  const iosItems = useHomeIosNativeHeaderItems();

  return useMemo(() => {
    if (shouldUseEgEdsAnimaNativePage()) {
      const hiddenTitle = egNavBarNativeStackOptions({
        title: t('tabs.home'),
        showTitle: false,
        showLeft: false,
        showRight: false,
        mode,
      });
      /** 只改标题/栏项；scroll edge 交给栈底 `EgEdsAnimaPage` defer + `useEgNavBarScroll`。 */
      return {
        title: hiddenTitle.title,
        headerTitleStyle: hiddenTitle.headerTitleStyle,
        ...iosItems,
        contentStyle: { backgroundColor: pageBackground },
      } as StackNavigationOptions;
    }

    return {
      ...edsPageRootScreenOptions,
      headerShown: false,
      cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
    };
  }, [iosItems, mode, pageBackground, t]);
}
