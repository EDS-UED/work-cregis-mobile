import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { edsPageBackground } from '@/utils/edsTheme';

/** 资产分布 — 首页栈内页；标题走 Stack / EgEdsAnimaPage 顶栏。 */
export function useAssetDistributionScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);

  return useMemo(() => {
    const title = t('home.assetDistribution');

    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        title,
        contentStyle: { backgroundColor: pageBackground },
      } as StackNavigationOptions;
    }

    return {
      title,
      ...edsPagePushedScreenOptions,
      cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
    };
  }, [pageBackground, t]);
}
