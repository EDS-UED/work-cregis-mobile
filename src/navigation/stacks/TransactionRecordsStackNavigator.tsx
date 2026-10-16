import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionRecordsScene } from '@/scenes/transaction-records/TransactionRecordsScene';
import { useCregisNativeStackScreenOptions } from '@/navigation/screenOptions/useCregisNativeStackScreenOptions';
import type { TransactionRecordsStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<TransactionRecordsStackParamList>();

export function TransactionRecordsStackNavigator() {
  const screenOptions = useCregisNativeStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TransactionRecordsMain" component={TransactionRecordsScene} />
    </Stack.Navigator>
  );
}
