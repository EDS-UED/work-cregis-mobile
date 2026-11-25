import { useCallback } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { EgEdsAnimaPage, shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';

import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { SCAN_NATIVE_NAV_MODE } from '@/scenes/scan/scanNativeIosHeader';

type ScreenOptionsProps = Parameters<ReturnType<typeof EgEdsAnimaPage>>[0];

/**
 * 扫码 Stack 页
 * - iOS 26+：系统 UINavigationBar · `mode: dark`（页内不再叠 `ScanTopBar`）
 * - 其余：无栈头 + 浮层 `ScanTopBar`
 */
export function useScanScreenOptions() {
  const { colors } = useEdsTheme();
  const { t } = useTranslation();
  const scanBackground = String(colors['material-same-black']);

  return useCallback(
    (props: ScreenOptionsProps): StackNavigationOptions => {
      const title = t('home.scan');

      if (shouldUseEgEdsAnimaNativePage()) {
        const base = EgEdsAnimaPage({ mode: SCAN_NATIVE_NAV_MODE })(props) as StackNavigationOptions;
        return {
          ...base,
          title,
          contentStyle: { backgroundColor: scanBackground },
        } as StackNavigationOptions;
      }

      return {
        title,
        headerShown: false,
        ...edsPagePushedScreenOptions,
        cardStyle: { backgroundColor: scanBackground, overflow: 'visible' },
      };
    },
    [scanBackground, t],
  );
}
