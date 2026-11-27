import { useCallback } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

import { egNavBarNativeStackClearHeaderItems } from '@/navigation/screenOptions/egNavBarNativeStackClearHeaderItems';
import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useHomeStore } from '@/store';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

/** 团队中心 — page **右左**（`horizontal-reverse` · 自左推入）+ `box-page`。 */
export function useTeamCenterScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const pageBackground = edsPageBackground(colors);

  return useCallback(
    (props: ScreenOptionsProps): StackNavigationOptions => {
      const base = EgEdsAnimaPage({ direction: 'horizontal-reverse', mode })(
        props,
      ) as StackNavigationOptions & NativeStackNavigationOptions;

      if (shouldUseEgEdsAnimaNativePage()) {
        return {
          ...base,
          title: teamDisplayName,
          ...egNavBarNativeStackClearHeaderItems(),
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions;
      }

      return {
        ...base,
        title: teamDisplayName,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
      };
    },
    [mode, pageBackground, teamDisplayName],
  );
}
