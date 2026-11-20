import { useCallback } from 'react';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import {
  EgEdsAnimaPage,
  shouldUseEgEdsAnimaNativePage,
} from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { HomeStackParamList } from '@/navigation/types';
import { messageCategoryLabelKey } from '@/scenes/messages/messagesCategoryPreview';
import { useMessagesIosNativeHeaderItems } from '@/scenes/messages/useMessagesIosNativeHeaderItems';
import { edsPageBackground } from '@/utils/edsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

/** 通知分类内页 — 标题随 `category`。 */
export function useMessagesCategoryScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);
  const iosRight = useMessagesIosNativeHeaderItems();

  return useCallback(
  (
    props: ScreenOptionsProps & {
      route: RouteProp<HomeStackParamList, 'MessagesCategory'>;
    },
  ): StackNavigationOptions => {
      const title = t(messageCategoryLabelKey[props.route.params.category]);

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