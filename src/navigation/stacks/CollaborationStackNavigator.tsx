import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CollaborationDetailScene } from '@/scenes/collaboration/CollaborationDetailScene';
import { CollaborationListScene } from '@/scenes/collaboration/CollaborationListScene';
import { useCregisNativeStackScreenOptions } from '@/navigation/screenOptions/useCregisNativeStackScreenOptions';
import type { CollaborationStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<CollaborationStackParamList>();

export function CollaborationStackNavigator() {
  const screenOptions = useCregisNativeStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CollaborationList" component={CollaborationListScene} />
      <Stack.Screen name="CollaborationDetail" component={CollaborationDetailScene} />
    </Stack.Navigator>
  );
}
