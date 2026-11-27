import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageCardBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** 设置交易密码。 */
export function useSetTransactionPasswordScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageCardBackground(colors);

  return useMemo(() => {
    const title = t('profile.transactionPasswordSetTitle');

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
