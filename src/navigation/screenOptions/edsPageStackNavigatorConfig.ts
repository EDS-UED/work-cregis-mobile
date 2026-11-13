import type { StackNavigationOptions } from '@react-navigation/stack';
import type { ComponentProps } from 'react';
import type { createStackNavigator } from '@react-navigation/stack';

import { shouldUseEgEdsAnimaNativePage } from '@/eds/page-motion';

type StackNavigatorProps = ComponentProps<ReturnType<typeof createStackNavigator>['Navigator']>;

/**
 * `@react-navigation/stack` · EDS page spring。
 * Showcase 同配：`detachInactiveScreens={false}`，避免 spring 过冲与全页拖拽手势异常。
 */
export const edsPageStackNavigatorProps: Pick<
  StackNavigatorProps,
  'detachInactiveScreens'
> = {
  detachInactiveScreens: false,
};

/** 仅 RN 栈附带；iOS 26+ native-stack 忽略。 */
export function edsPageStackNavigatorExtraProps(): Partial<
  Pick<StackNavigatorProps, 'detachInactiveScreens'>
> {
  return shouldUseEgEdsAnimaNativePage() ? {} : edsPageStackNavigatorProps;
}

/** Tab / Stack 根屏 — 无下层卡片，关闭压暗 overlay。 */
export const edsPageRootScreenOptions: StackNavigationOptions = {
  cardOverlayEnabled: false,
};

/** Push 子页 — 下层压暗 + 视差。 */
export const edsPagePushedScreenOptions: StackNavigationOptions = {
  cardOverlayEnabled: true,
};
