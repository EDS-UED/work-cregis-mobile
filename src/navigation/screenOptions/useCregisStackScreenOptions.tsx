import { useCallback } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPageBackground } from '@/utils/edsTheme';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

/** Stack 默认 — `EgEdsAnimaPage` + 页面底色 `box-page`。 */
export function useCregisStackScreenOptions() {
  const { colors, mode } = useEdsTheme();
  const pageBackground = edsPageBackground(colors);
  return useCallback(
    (props: ScreenOptionsProps): StackNavigationOptions => {
      const base = EgEdsAnimaPage({ mode })(props) as StackNavigationOptions &
        NativeStackNavigationOptions;

      if (shouldUseEgEdsAnimaNativePage()) {
        return {
          ...base,
          contentStyle: { backgroundColor: pageBackground },
        } as StackNavigationOptions;
      }

      return {
        ...base,
        cardStyle: {
          backgroundColor: pageBackground,
          overflow: 'visible',
        },
      };
    },
    [mode, pageBackground],
  );
}
