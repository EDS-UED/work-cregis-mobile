import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CollaborationDetailScene } from '@/scenes/collaboration/CollaborationDetailScene';
import { CollaborationListScene } from '@/scenes/collaboration/CollaborationListScene';
import { stackScreenOptions } from '@/navigation/screenOptions/stackOptions';
import type { CollaborationStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<CollaborationStackParamList>();

export function CollaborationStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="CollaborationList" component={CollaborationListScene} />
      <Stack.Screen name="CollaborationDetail" component={CollaborationDetailScene} />
    </Stack.Navigator>
  );
}
