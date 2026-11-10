import type { ComponentType } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CregisTabBar } from '@/navigation/CregisTabBar';
import { shouldUseNativeRootTabBar } from '@/navigation/nativeEdsRuntime';
import { HomeStackNavigator } from '@/navigation/stacks/HomeStackNavigator';
import type { RootTabParamList } from '@/navigation/types';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { edsPageBackground } from '@/utils/edsTheme';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** 首屏仅解析 Home 栈；其它 Tab 在首次聚焦时再 `require`，缩短初始 Metro bundle。 */
function tabStackWhenFocused(
  loader: () => ComponentType<object>,
): ComponentType<object> {
  let cached: ComponentType<object> | null = null;
  return function TabStackScreen(props: object) {
    if (!cached) {
      cached = loader();
    }
    const Screen = cached;
    return <Screen {...props} />;
  };
}

const WalletStack = tabStackWhenFocused(
  () =>
    require('@/navigation/stacks/AssetsStackNavigator').AssetsStackNavigator as ComponentType<object>,
);
const CollaborationStack = tabStackWhenFocused(
  () =>
    require('@/navigation/stacks/CollaborationStackNavigator')
      .CollaborationStackNavigator as ComponentType<object>,
);
const TransactionRecordsStack = tabStackWhenFocused(
  () =>
    require('@/navigation/stacks/TransactionRecordsStackNavigator')
      .TransactionRecordsStackNavigator as ComponentType<object>,
);

function RootTabNavigatorRn() {
  const colors = useThemeColors();

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
      <Tab.Screen name="Wallet" component={WalletStack} options={{ lazy: true }} />
      <Tab.Screen name="Collaboration" component={CollaborationStack} options={{ lazy: true }} />
      <Tab.Screen
        name="TransactionRecords"
        component={TransactionRecordsStack}
        options={{ lazy: true }}
      />
    </Tab.Navigator>
  );
}

/** iOS 26+ 系统 Tab 条（EDS）；Android / iOS ≤25 走 RN `EgCregisTabBar`。 */
export function RootTabNavigator() {
  if (shouldUseNativeRootTabBar()) {
    const { RootTabNavigatorNativeTabs } =
      require('@/navigation/RootTabNavigatorNativeTabs') as typeof import('@/navigation/RootTabNavigatorNativeTabs');
    return <RootTabNavigatorNativeTabs />;
  }

  return <RootTabNavigatorRn />;
}
