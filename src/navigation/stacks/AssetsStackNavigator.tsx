import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AssetsScene } from '@/scenes/assets/AssetsScene';
import { useCregisNativeStackScreenOptions } from '@/navigation/screenOptions/useCregisNativeStackScreenOptions';
import type { AssetsStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsStackNavigator() {
  const screenOptions = useCregisNativeStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AssetsMain" component={AssetsScene} />
    </Stack.Navigator>
  );
}
