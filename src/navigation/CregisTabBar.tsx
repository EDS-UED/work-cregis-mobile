import {
  EgCregisTabBar,
  EgTabBarBottomTabsDock,
  createEgCregisTabBarBottomTabsBinding,
} from '@eds-evergreen/mobile';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useEdsTheme } from '@/hooks/useEdsTheme';

/** Android / iOS ≤25 — RN 自定义 tabBar；iOS 26+ 走 `RootTabNavigator` 系统 Tab 条。 */
export function CregisTabBar({ state, navigation }: BottomTabBarProps) {
  const { mode } = useEdsTheme();
  const binding = createEgCregisTabBarBottomTabsBinding(state, navigation);

  return (
    <EgTabBarBottomTabsDock>
      <EgCregisTabBar testID="cregis-tab-bar" mode={mode} {...binding} />
    </EgTabBarBottomTabsDock>
  );
}
