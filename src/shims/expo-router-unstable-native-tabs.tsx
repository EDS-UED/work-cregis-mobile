/**
 * EDS `@eds-evergreen/mobile` barrel 会静态引用 `EgTabBarNativeLayout`（Expo Router 专用）。
 * Cregis 使用 React Navigation Native Tabs（`RootTabNavigator`），运行时不走此 API。
 * SDK 56+ 禁止与 expo-router 并存，故用 Metro alias 满足 bundle 解析。
 */
import type { ReactNode } from 'react';
import { View } from 'react-native';

function NativeTabsRoot({ children }: { children?: ReactNode }) {
  return <View>{children}</View>;
}

function NativeTabsTrigger({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

NativeTabsTrigger.Icon = function NativeTabsTriggerIcon() {
  return null;
};

NativeTabsTrigger.Label = function NativeTabsTriggerLabel() {
  return null;
};

NativeTabsTrigger.Badge = function NativeTabsTriggerBadge() {
  return null;
};

export const NativeTabs = Object.assign(NativeTabsRoot, {
  Trigger: NativeTabsTrigger,
});
