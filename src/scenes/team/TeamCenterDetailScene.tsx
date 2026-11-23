import type { RouteProp } from '@react-navigation/native';

import { EgPage } from '@/eds/page';
import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import type { HomeStackParamList } from '@/navigation/types';
import { useHideTabBarForInnerPage } from '@/hooks/useHideTabBarForInnerPage';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type TeamCenterDetailSceneProps = {
  route: RouteProp<HomeStackParamList, 'TeamCenterDetail'>;
};

/** 团队中心子页占位 · 栈标题 + `EgPage` 空壳。 */
export function TeamCenterDetailScene({ route: _route }: TeamCenterDetailSceneProps) {
  const { mode } = useEdsTheme();
  const nativeNavBar = shouldUseEgNavBarNativeStack();

  useHideTabBarForInnerPage(true);

  return (
    <EgPage mode={mode} nativeScrollEdge={nativeNavBar}>
      {null}
    </EgPage>
  );
}