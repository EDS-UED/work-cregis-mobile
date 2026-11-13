import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { TransactionRecordsScene } from '@/scenes/transaction-records/TransactionRecordsScene';
import {
  edsPageRootScreenOptions,
  edsPageStackNavigatorExtraProps,
} from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { TransactionRecordsStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<TransactionRecordsStackParamList>();

export function TransactionRecordsStackNavigator() {
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="TransactionRecordsMain"
        component={TransactionRecordsScene}
        options={{ ...edsPageRootScreenOptions }}
      />
    </Stack.Navigator>
  );
}
