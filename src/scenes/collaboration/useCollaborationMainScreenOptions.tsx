import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageRootScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { edsPageBackground } from '@/utils/edsTheme';

/** 协作 Tab 根屏 — 自定义顶栏在内容区，系统 Nav 隐藏。 */
export function useCollaborationMainScreenOptions(): StackNavigationOptions {
  const { colors } = useEdsTheme();
  const pageBackground = edsPageBackground(colors);

  return useMemo(() => {
    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        headerShown: false,
        contentStyle: { backgroundColor: pageBackground },
      } as StackNavigationOptions;
    }

    return {
      ...edsPageRootScreenOptions,
      headerShown: false,
      cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
    };
  }, [pageBackground]);
}
