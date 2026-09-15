import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScene } from '@/scenes/profile/ProfileScene';
import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';
import type { ProfileStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScene} />
    </Stack.Navigator>
  );
}
