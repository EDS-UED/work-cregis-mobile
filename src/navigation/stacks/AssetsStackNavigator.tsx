import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AssetsScene } from '@/scenes/assets/AssetsScene';
import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';
import type { AssetsStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="AssetsMain" component={AssetsScene} />
    </Stack.Navigator>
  );
}
