import { useMemo } from 'react';
import type { StackNavigationOptions } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { egNavBarNativeStackOptions } from '@/eds/nav-bar';
import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPagePushedScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { edsPageBackground } from '@/utils/edsTheme';
import { useHomeIosNativeHeaderItems } from '@/scenes/home/useHomeIosNativeHeaderItems';

/**
 * 对比 · 主页快照 — iOS 26+ 与 `useHomeMainScreenOptions` 同套系统 Nav（名称 + 右侧胶囊 + scroll edge）。
 * Android / iOS ≤25：`headerShown: false` + `CompareHomeSnapshotTopBar`。
 */
export function useCompareHomeSnapshotScreenOptions(): StackNavigationOptions {
  const { colors, mode } = useEdsTheme();
  const { t } = useTranslation();
  const pageBackground = edsPageBackground(colors);
  const iosItems = useHomeIosNativeHeaderItems();

  return useMemo(() => {
    if (shouldUseEgEdsAnimaNativePage()) {
      return {
        ...egNavBarNativeStackOptions({
          title: t('tabs.home'),
          showTitle: false,
          showLeft: false,
          showRight: false,
          mode,
        }),
        ...iosItems,
        contentStyle: { backgroundColor: pageBackground },
      } as StackNavigationOptions;
    }

    return {
      ...edsPagePushedScreenOptions,
      headerShown: false,
      cardStyle: { backgroundColor: pageBackground, overflow: 'visible' },
    };
  }, [iosItems, mode, pageBackground, t]);
}