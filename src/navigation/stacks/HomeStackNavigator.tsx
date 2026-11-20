import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import { HomeMainScreen } from '@/scenes/home/HomeMainScreen';
import { MessagesCategoryScene } from '@/scenes/messages/MessagesCategoryScene';
import { MessagesHubScene } from '@/scenes/messages/MessagesHubScene';
import { PersonalCenterScene } from '@/scenes/profile/PersonalCenterScene';
import { ScanScene } from '@/scenes/scan/ScanScene';
import { TeamCenterDetailScene } from '@/scenes/team/TeamCenterDetailScene';
import { TeamCenterScene } from '@/scenes/team/TeamCenterScene';
import { usePersonalCenterScreenOptions } from '@/scenes/profile/usePersonalCenterScreenOptions';
import { useTeamCenterScreenOptions } from '@/scenes/team/useTeamCenterScreenOptions';
import { useTeamCenterDetailScreenOptions } from '@/scenes/team/useTeamCenterDetailScreenOptions';
import { useMessagesCategoryScreenOptions } from '@/scenes/messages/useMessagesCategoryScreenOptions';
import { useMessagesScreenOptions } from '@/scenes/messages/useMessagesScreenOptions';
import { useScanScreenOptions } from '@/scenes/scan/useScanScreenOptions';
import { edsPageStackNavigatorExtraProps } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  const personalCenterOptions = usePersonalCenterScreenOptions();
  const teamCenterOptions = useTeamCenterScreenOptions();
  const teamCenterDetailOptions = useTeamCenterDetailScreenOptions();
  const messagesOptions = useMessagesScreenOptions();
  const scanOptions = useScanScreenOptions();
  const messagesCategoryOptions = useMessagesCategoryScreenOptions();
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen name="HomeMain" component={HomeMainScreen} />
      <Stack.Screen
        name="PersonalCenter"
        component={PersonalCenterScene}
        options={(props) => ({
          ...screenOptions(props),
          ...personalCenterOptions,
        })}
      />
      <Stack.Screen
        name="TeamCenter"
        component={TeamCenterScene}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterOptions(props),
        })}
      />
      <Stack.Screen
        name="TeamCenterDetail"
        component={TeamCenterDetailScene}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterDetailOptions(props),
        })}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesHubScene}
        options={(props) => ({
          ...screenOptions(props),
          ...messagesOptions(props),
        })}
      />
      <Stack.Screen
        name="MessagesCategory"
        component={MessagesCategoryScene}
        options={(props) => ({
          ...screenOptions(props),
          ...messagesCategoryOptions(props),
        })}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScene}
        options={(props) => ({
          ...screenOptions(props),
          ...scanOptions,
        })}
      />
    </Stack.Navigator>
  );
}