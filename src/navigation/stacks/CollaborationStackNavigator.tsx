import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { CollaborationDetailScene } from '@/scenes/collaboration/CollaborationDetailScene';
import { CollaborationListScene } from '@/scenes/collaboration/CollaborationListScene';
import {
  edsPagePushedScreenOptions,
  edsPageRootScreenOptions,
  edsPageStackNavigatorExtraProps,
} from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { CollaborationStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<CollaborationStackParamList>();

export function CollaborationStackNavigator() {
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="CollaborationList"
        component={CollaborationListScene}
        options={{ ...edsPageRootScreenOptions }}
      />
      <Stack.Screen
        name="CollaborationDetail"
        component={CollaborationDetailScene}
        options={{ ...edsPagePushedScreenOptions }}
      />
    </Stack.Navigator>
  );
}
