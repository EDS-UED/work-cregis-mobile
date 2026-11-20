import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

import { AssetsStackNavigator } from '@/navigation/stacks/AssetsStackNavigator';
import { CollaborationStackNavigator } from '@/navigation/stacks/CollaborationStackNavigator';
import { HomeStackNavigator } from '@/navigation/stacks/HomeStackNavigator';
import { TransactionRecordsStackNavigator } from '@/navigation/stacks/TransactionRecordsStackNavigator';
import type { RootTabParamList } from '@/navigation/types';
import { cregisNativeTabBarScreenOptions } from '@/navigation/cregisNativeTabBarScreenOptions';
import { homeTabScreenOptionsNative } from '@/navigation/homeTabScreenOptions';
import { useEdsTheme } from '@/hooks/useEdsTheme';

const NativeTab = createNativeBottomTabNavigator<RootTabParamList>();

/** iOS 26+ 系统 Tab — 独立文件，Android 不 import（避免 Native Tabs 原生模块在 Expo Go 闪退）。 */
export function RootTabNavigatorNativeTabs() {
  const { mode } = useEdsTheme();

  return (
    <NativeTab.Navigator screenOptions={cregisNativeTabBarScreenOptions({ mode })}>
      <NativeTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={homeTabScreenOptionsNative}
      />
      <NativeTab.Screen name="Wallet" component={AssetsStackNavigator} />
      <NativeTab.Screen name="Collaboration" component={CollaborationStackNavigator} />
      <NativeTab.Screen name="TransactionRecords" component={TransactionRecordsStackNavigator} />
    </NativeTab.Navigator>
  );
}
