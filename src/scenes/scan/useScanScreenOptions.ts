import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** 扫码 Stack 页 · 全屏相机 + 浮层 `ScanTopBar`（不经 EDS 栈头）。 */
export function useScanScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const scanBackground = String(colors['material-same-black']);

  return useMemo(() => {
    const title = t('home.scan');
    const chromeless = {
      title,
      headerShown: false,
    } as const;

    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        ...chromeless,
        contentStyle: { backgroundColor: scanBackground },
      } as StackNavigationOptions;
    }

    return {
      ...chromeless,
      ...edsPagePushedScreenOptions,
      cardStyle: { backgroundColor: scanBackground, overflow: 'visible' },
    };
  }, [scanBackground, t]);
}