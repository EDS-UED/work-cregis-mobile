import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { egNavBarNativeStackOptions } from '@/eds/nav-bar';
import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageRootScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { edsPageBackground } from '@/utils/edsTheme';

import { useWalletIosNativeHeaderItems } from '@/scenes/assets/useWalletIosNativeHeaderItems';

export function useWalletMainScreenOptions(): StackNavigationOptions {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);
  const iosItems = useWalletIosNativeHeaderItems();

  return useMemo(() => {
    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        ...egNavBarNativeStackOptions({
          title: t('tabs.wallet'),
          showTitle: false,
          showLeft: false,
          showRight: false,
          mode,
        }),
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
