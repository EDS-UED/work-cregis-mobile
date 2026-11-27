import { useCallback } from 'react';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { HomeStackParamList } from '@/navigation/types';
import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { teamCenterDetailTitleKey } from '@/scenes/team/teamCenterDetail';
import { useTeamCenterDetailIosNativeHeaderItems } from '@/scenes/team/useTeamCenterDetailIosNativeHeaderItems';
import { edsPageBackground } from '@/utils/edsTheme';
import { useTranslation } from 'react-i18next';

type Nav = { goBack: () => void };

export function useTeamCenterDetailScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const resolveNativeHeaderItems = useTeamCenterDetailIosNativeHeaderItems();

  return useCallback(
    (props: {
      route: RouteProp<HomeStackParamList, 'TeamCenterDetail'>;
      navigation: Nav;
    }): StackNavigationOptions => {
      const { id } = props.route.params;
      const title = t(teamCenterDetailTitleKey(id));
      const pageBackground = edsPageBackground(colors);
      const nativeHeaderItems = resolveNativeHeaderItems(id);

      if (shouldUseEgEdsAnimaNativePage()) {
        const base = EgEdsAnimaPage({ mode })(props) as StackNavigationOptions &
          NativeStackNavigationOptions;
        return {
          ...base,
          title,
          ...nativeHeaderItems,
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions & NativeStackNavigationOptions;
      }

      return {
        title,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
      };
    },
    [colors, mode, resolveNativeHeaderItems, t],
  );
}