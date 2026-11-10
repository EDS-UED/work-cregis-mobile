import { useMemo } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

import { pushSlideScreenOptions } from '@/navigation/screenOptions/stackOptions';

/** 个人中心 — 覆盖栈默认动效为横向 push；顶栏与协作详情同由 Stack + `SceneScaffold` 负责。 */
export function usePersonalCenterScreenOptions(): NativeStackNavigationOptions {
  const { colors } = useEdsTheme();
  const pageBackground = edsPageBackground(colors);

  return useMemo(() => {
    const base: NativeStackNavigationOptions = {
      ...pushSlideScreenOptions,
      contentStyle: { backgroundColor: pageBackground },
    };

    if (!shouldUseEgNavBarNativeStack()) {
      return { ...base, headerShown: false };
    }

    return base;
  }, [pageBackground]);
}
