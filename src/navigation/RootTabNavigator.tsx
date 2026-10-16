import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import {
  egCregisTabBarNativeBottomTabsScreenOptions,
  shouldUseEgTabBarNativeStack,
} from '@eds-evergreen/mobile';

import { CregisTabBar } from '@/navigation/CregisTabBar';
import { AssetsStackNavigator } from '@/navigation/stacks/AssetsStackNavigator';
import { CollaborationStackNavigator } from '@/navigation/stacks/CollaborationStackNavigator';
import { HomeStackNavigator } from '@/navigation/stacks/HomeStackNavigator';
import { TransactionRecordsStackNavigator } from '@/navigation/stacks/TransactionRecordsStackNavigator';
import type { RootTabParamList } from '@/navigation/types';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { edsPageBackground } from '@/utils/edsTheme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const NativeTab = createNativeBottomTabNavigator<RootTabParamList>();

/** iOS 26+ 系统 Tab 条（EDS 强制）；其它平台 RN `EgCregisTabBar`。 */
export function RootTabNavigator() {
  const colors = useThemeColors();
  const { mode } = useEdsTheme();

  if (shouldUseEgTabBarNativeStack()) {
    return (
      <NativeTab.Navigator screenOptions={egCregisTabBarNativeBottomTabsScreenOptions({ mode })}>
        <NativeTab.Screen name="Home" component={HomeStackNavigator} />
        <NativeTab.Screen name="Wallet" component={AssetsStackNavigator} />
        <NativeTab.Screen name="Collaboration" component={CollaborationStackNavigator} />
        <NativeTab.Screen name="TransactionRecords" component={TransactionRecordsStackNavigator} />
      </NativeTab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CregisTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: edsPageBackground(colors) },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Wallet" component={AssetsStackNavigator} />
      <Tab.Screen name="Collaboration" component={CollaborationStackNavigator} />
      <Tab.Screen name="TransactionRecords" component={TransactionRecordsStackNavigator} />
    </Tab.Navigator>
  );
}
