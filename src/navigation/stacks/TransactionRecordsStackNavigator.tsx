import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { CompareHomeTodoCardScreen } from '@/scenes/compare/home-todo-card/CompareHomeTodoCardScreen';
import { CompareHomeTodoDividerScreen } from '@/scenes/compare/home-todo-divider/CompareHomeTodoDividerScreen';
import {
  CompareTeamCenterCardGrayScene,
  CompareTeamCenterCardTraditionalScene,
} from '@/scenes/compare/team-center-card/CompareTeamCenterCardScene';
import { useCompareTeamCenterCardScreenOptions } from '@/scenes/compare/team-center-card/useCompareTeamCenterCardScreenOptions';
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
  const compareTeamCenterTraditionalOptions =
    useCompareTeamCenterCardScreenOptions('traditional');
  const compareTeamCenterGrayOptions =
    useCompareTeamCenterCardScreenOptions('gray');

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
      <Stack.Screen
        name="CompareTeamCenterCardTraditional"
        component={CompareTeamCenterCardTraditionalScene}
        options={(props) => ({
          ...screenOptions(props),
          ...compareTeamCenterTraditionalOptions(props),
        })}
      />
      <Stack.Screen
        name="CompareTeamCenterCardGray"
        component={CompareTeamCenterCardGrayScene}
        options={(props) => ({
          ...screenOptions(props),
          ...compareTeamCenterGrayOptions(props),
        })}
      />
      <Stack.Screen
        name="CompareHomeTodoCard"
        component={CompareHomeTodoCardScreen}
      />
      <Stack.Screen
        name="CompareHomeTodoDivider"
        component={CompareHomeTodoDividerScreen}
      />
    </Stack.Navigator>
  );
}