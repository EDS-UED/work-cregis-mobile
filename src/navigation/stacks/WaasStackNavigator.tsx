import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WaasScene } from '@/scenes/waas/WaasScene';
import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';
import type { WaasStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<WaasStackParamList>();

export function WaasStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="WaasMain" component={WaasScene} />
    </Stack.Navigator>
  );
}
