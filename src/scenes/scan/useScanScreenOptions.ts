import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** 扫码 Stack 页 · EDS page + `box-page`（系统栏无法挂 page-shot trigger 时的回退）。 */
export function useScanScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const scanBackground = String(colors['material-same-black']);

  return useMemo(() => {
    const title = t('home.scan');

    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        title,
        contentStyle: { backgroundColor: scanBackground },
      } as StackNavigationOptions;
    }

    return {
      title,
      ...edsPagePushedScreenOptions,
      cardStyle: { backgroundColor: scanBackground, overflow: 'visible' },
    };
  }, [scanBackground, t]);
}
