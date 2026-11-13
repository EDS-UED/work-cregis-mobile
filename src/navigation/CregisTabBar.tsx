import {
  CREGIS_TAB_BAR_ITEMS,
  EgTabBar,
  EgTabBarBottomTabsDock,
  createEgCregisTabBarBottomTabsBinding,
} from '@/eds/cregis-tab-bar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';

/** Android / iOS ≤25 — RN 自定义 tabBar；iOS 26+ 走 `RootTabNavigator` 系统 Tab 条。 */
export function CregisTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const { mode } = useEdsTheme();
  const binding = createEgCregisTabBarBottomTabsBinding(state, navigation);
  const focusedOptions = descriptors[state.routes[state.index]!.key]?.options;
  if (StyleSheet.flatten(focusedOptions?.tabBarStyle)?.display === 'none') {
    return null;
  }

  return (
    <EgTabBarBottomTabsDock>
      <EgTabBar
        testID="cregis-tab-bar"
        mode={mode}
        items={CREGIS_TAB_BAR_ITEMS}
        selectionAccent="decor"
        {...binding}
      />
    </EgTabBarBottomTabsDock>
  );
}
