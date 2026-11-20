import { useCallback } from 'react';
import {
  useFocusEffect,
  useNavigation,
  type NavigationState,
} from '@react-navigation/native';

import {
  applyHomeTabBarStyleForTabState,
  CREGIS_RN_TAB_BAR_STYLE,
  getHomeStackFocusedRouteName,
  shouldHideTabBarForHomeStackRoute,
} from '@/navigation/homeTabScreenOptions';
import { shouldUseNativeRootTabBar } from '@/navigation/nativeEdsRuntime';

type NavWithParent = {
  getParent: () => NavWithParent | undefined;
  getState: () => { type?: string } | undefined;
  setOptions: (options: { tabBarStyle?: object }) => void;
};

function findTabNavigator(navigation: NavWithParent): NavWithParent | undefined {
  let tab: NavWithParent | undefined = navigation.getParent();
  while (tab && tab.getState()?.type !== 'tab') {
    tab = tab.getParent();
  }
  return tab;
}

/** Stack 子页 — 聚焦隐藏 Tab；`homeTabScreenOptions` 已藏条时跳过重复 `setOptions`。 */
export function useHideTabBarForInnerPage(enabled: boolean) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      const tab = findTabNavigator(navigation as NavWithParent);
      if (!tab) return;

      const tabState = tab.getState() as NavigationState | undefined;
      const focused = getHomeStackFocusedRouteName(tabState);
      if (shouldHideTabBarForHomeStackRoute(focused)) {
        return;
      }

      tab.setOptions({ tabBarStyle: { display: 'none' } });

      return () => {
        applyHomeTabBarStyleForTabState(
          (options) => tab.setOptions(options),
          tab.getState() as NavigationState | undefined,
          shouldUseNativeRootTabBar() ? undefined : CREGIS_RN_TAB_BAR_STYLE,
        );
      };
    }, [enabled, navigation]),
  );
}