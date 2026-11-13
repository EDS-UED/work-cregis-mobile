import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { WalletMainScreen } from '@/scenes/assets/WalletMainScreen';
import {
  edsPageRootScreenOptions,
  edsPageStackNavigatorExtraProps,
} from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { AssetsStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<AssetsStackParamList>();

export function AssetsStackNavigator() {
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="AssetsMain"
        component={WalletMainScreen}
        options={{ ...edsPageRootScreenOptions }}
      />
    </Stack.Navigator>
  );
}
