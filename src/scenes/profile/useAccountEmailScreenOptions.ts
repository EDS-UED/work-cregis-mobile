import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageCardBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

function useCardPageOptions(title: string): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const pageBackground = edsPageCardBackground(colors);

  return useMemo(() => {
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
  }, [pageBackground, title]);
}

/** 电子邮箱。 */
export function useAccountEmailScreenOptions(): StackNavigationOptions {
  const { t } = useTranslation();
  return useCardPageOptions(t('profile.email'));
}

/** 重置电子邮箱。 */
export function useResetAccountEmailScreenOptions(): StackNavigationOptions {
  const { t } = useTranslation();
  return useCardPageOptions(t('profile.accountEmailResetTitle'));
}
