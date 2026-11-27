import {
  getFocusedRouteNameFromRoute,
  type NavigationState,
  type ParamListBase,
  type RouteProp,
} from '@react-navigation/native';

import type { HomeStackParamList } from '@/navigation/types';

export const TAB_BAR_HIDDEN_HOME_STACK_ROUTES = new Set<keyof HomeStackParamList>([
  'PersonalCenter',
  'ProfileEdit',
  'IdentityVerification',
  'AccountEmail',
  'ResetAccountEmail',
  'GoogleAuthenticator',
  'SetTransactionPassword',
  'LoginDevices',
  'MpcNetworkSettings',
  'About',
  'TeamCenter',
  'TeamCenterDetail',
  'Messages',
  'MessagesCategory',
  'MessagesAnnouncement',
  'Scan',
]);

export const CREGIS_RN_TAB_BAR_STYLE = {
  position: 'absolute' as const,
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  elevation: 0,
};

type HomeTabBarStyle = typeof CREGIS_RN_TAB_BAR_STYLE | { display: 'none' };

export function getHomeStackFocusedRouteName(
  tabState: NavigationState | undefined,
): keyof HomeStackParamList | 'HomeMain' {
  const homeRoute = tabState?.routes.find((route) => route.name === 'Home');
  if (!homeRoute) {
    return 'HomeMain';
  }
  return (getFocusedRouteNameFromRoute(homeRoute) ?? 'HomeMain') as
    | keyof HomeStackParamList
    | 'HomeMain';
}

export function shouldHideTabBarForHomeStackRoute(routeName: string): boolean {
  return TAB_BAR_HIDDEN_HOME_STACK_ROUTES.has(routeName as keyof HomeStackParamList);
}

/** 按 Home 栈顶路由同步底部 Tab 显隐（供 `useHideTabBarForInnerPage` blur 等）。 */
export function applyHomeTabBarStyleForTabState(
  setOptions: (options: { tabBarStyle?: HomeTabBarStyle }) => void,
  tabState: NavigationState | undefined,
  visibleStyle: HomeTabBarStyle | undefined = CREGIS_RN_TAB_BAR_STYLE,
) {
  const focused = getHomeStackFocusedRouteName(tabState);
  if (shouldHideTabBarForHomeStackRoute(focused)) {
    setOptions({ tabBarStyle: { display: 'none' } });
    return;
  }
  setOptions({ tabBarStyle: visibleStyle });
}

export function resolveHomeTabBarStyle(
  route: RouteProp<ParamListBase, string>,
  visibleStyle?: HomeTabBarStyle,
): HomeTabBarStyle | undefined {
  const focused = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
  if (TAB_BAR_HIDDEN_HOME_STACK_ROUTES.has(focused as keyof HomeStackParamList)) {
    return { display: 'none' };
  }
  return visibleStyle;
}

/** Home 栈内页（含通知）— 按当前栈顶路由隐藏底部 Tab。 */
export function homeTabScreenOptions({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) {
  return {
    tabBarStyle: resolveHomeTabBarStyle(route, CREGIS_RN_TAB_BAR_STYLE),
  };
}

/** iOS 26+ 系统 Tab — 可见时不覆盖 `tabBarStyle`。 */
export function homeTabScreenOptionsNative({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) {
  const style = resolveHomeTabBarStyle(route);
  return style ? { tabBarStyle: style } : {};
}