import { useCallback } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  egNavBarNativeStackScreenOptions,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';

type StackScreenOptionsArgs = {
  navigation: { goBack: () => void };
};

/** iOS 26+ — 与 EDS Showcase 同用 `egNavBarNativeStackScreenOptions`（返回已走 unstable 栏项，不叠双层玻璃）。 */
export function useCregisNativeStackScreenOptions() {
  const { t } = useTranslation();
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
          backAccessibilityLabel: t('common.back'),
        }),
        contentStyle: { backgroundColor: pageBackground },
        statusBarTranslucent: true,
        statusBarBackgroundColor: 'transparent',
      };
    },
    [mode, pageBackground, t],
  );
}
