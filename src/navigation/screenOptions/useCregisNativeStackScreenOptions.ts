import { useCallback } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  egNavBarNativeStackScreenOptions,
  shouldUseEgNavBarNativeStack,
} from '@eds-evergreen/mobile';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';

type StackScreenOptionsArgs = {
  navigation: { goBack: () => void };
};

/**
 * iOS 26+ — 与 EDS Showcase `useShowcaseStackScreenOptions` 同法：
 * 系统 `UINavigationBar` + `background: 'auto'` → `scrollEdgeEffects`（栏背景随内容滚入，继承原生 Liquid Glass）。
 */
export function useCregisNativeStackScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const pageBackground = edsPageBackground(colors);

  return useCallback(
    ({ navigation }: StackScreenOptionsArgs): NativeStackNavigationOptions => {
      if (!shouldUseEgNavBarNativeStack()) {
        return stackScreenOptions;
      }

      return {
        ...stackScreenOptions,
        ...egNavBarNativeStackScreenOptions({
          mode,
          background: 'auto',
          onBack: () => navigation.goBack(),
        }),
        contentStyle: { backgroundColor: pageBackground },
        statusBarTranslucent: true,
        statusBarBackgroundColor: 'transparent',
      };
    },
    [mode, pageBackground],
  );
}
