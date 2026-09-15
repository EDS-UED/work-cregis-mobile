import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScene } from '@/scenes/home/HomeScene';
import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScene} />
    </Stack.Navigator>
  );
}
