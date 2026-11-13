import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { shouldUseNativeRootTabBar } from '@/navigation/nativeEdsRuntime';

const RN_TAB_BAR_STYLE = {
  position: 'absolute' as const,
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  elevation: 0,
};

/** Stack 子页（设置 / 团队中心等）— 隐藏底部 Tab，离开时恢复。 */
export function useHideTabBarForInnerPage(enabled: boolean) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (!enabled) return;
    let tab = navigation.getParent();
    while (tab && tab.getState()?.type !== 'tab') {
      tab = tab.getParent();
    }
    if (!tab) return;

    if (shouldUseNativeRootTabBar()) {
      tab.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        tab.setOptions({ tabBarStyle: undefined });
      };
    }

    tab.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      tab.setOptions({ tabBarStyle: RN_TAB_BAR_STYLE });
    };
  }, [enabled, navigation]);
}
