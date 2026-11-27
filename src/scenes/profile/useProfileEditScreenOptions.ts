import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageCardBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** 管理个人资料 — 与设置页同一套 page 背景与顶栏。 */
export function useProfileEditScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageCardBackground(colors);

  return useMemo(() => {
    const title = t('profile.changeNickname');

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
