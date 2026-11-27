import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageCardBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** MPC 网络设置 — 与设置页相同的 `box-page-card` 浅灰底。 */
export function useMpcNetworkSettingsScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageCardBackground(colors);

  return useMemo(() => {
    const title = t('profile.mpcNetworkSettings');

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
