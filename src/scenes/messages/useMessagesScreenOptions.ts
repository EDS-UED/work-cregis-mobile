import { useCallback } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useMessagesIosNativeHeaderItems } from '@/scenes/messages/useMessagesIosNativeHeaderItems';
import { edsPageBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

/** 通知 — EDS page + `box-page`；右栏 `eds-clear` 图标。 */
export function useMessagesScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);
  const iosRight = useMessagesIosNativeHeaderItems();

  return useCallback(
    (props: ScreenOptionsProps): StackNavigationOptions => {
      const title = t('messages.title');

      if (shouldUseEgEdsAnimaNativePage()) {
        const base = EgEdsAnimaPage({ mode })(props) as StackNavigationOptions;
        return {
          ...base,
          title,
          ...iosRight,
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions;
      }

      return {
        title,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
      };
    },
    [iosRight, mode, pageBackground, t],
  );
}
