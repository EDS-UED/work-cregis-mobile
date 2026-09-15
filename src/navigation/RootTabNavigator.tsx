import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CregisTabBar } from '@/navigation/CregisTabBar';
import { AssetsStackNavigator } from '@/navigation/stacks/AssetsStackNavigator';
import { CollaborationStackNavigator } from '@/navigation/stacks/CollaborationStackNavigator';
import { HomeStackNavigator } from '@/navigation/stacks/HomeStackNavigator';
import { ProfileStackNavigator } from '@/navigation/stacks/ProfileStackNavigator';
import { WaasStackNavigator } from '@/navigation/stacks/WaasStackNavigator';
import type { RootTabParamList } from '@/navigation/types';
import { useThemeColors } from '@/hooks/useEffectiveTheme';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabNavigator() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      tabBar={(props) => <CregisTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.page },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Collaboration" component={CollaborationStackNavigator} />
      <Tab.Screen name="Assets" component={AssetsStackNavigator} />
      <Tab.Screen name="Waas" component={WaasStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
