import { createCregisPageStackNavigator } from '@/navigation/createCregisPageStackNavigator';

import type { ComponentType } from 'react';
import { HomeMainScreen } from '@/scenes/home/HomeMainScreen';
import { MessagesCategoryScene } from '@/scenes/messages/MessagesCategoryScene';
import { useMessagesCategoryScreenOptions } from '@/scenes/messages/useMessagesCategoryScreenOptions';
import { useMessagesScreenOptions } from '@/scenes/messages/useMessagesScreenOptions';
import { usePersonalCenterScreenOptions } from '@/scenes/profile/usePersonalCenterScreenOptions';
import { useScanScreenOptions } from '@/scenes/scan/useScanScreenOptions';
import { useTeamCenterDetailScreenOptions } from '@/scenes/team/useTeamCenterDetailScreenOptions';
import { useTeamCenterScreenOptions } from '@/scenes/team/useTeamCenterScreenOptions';
import { edsPageStackNavigatorExtraProps } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';
import { useCregisStackScreenOptions } from '@/navigation/screenOptions/useCregisStackScreenOptions';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createCregisPageStackNavigator<HomeStackParamList>();

let personalCenterScreen: ComponentType<object> | null = null;
let teamCenterScreen: ComponentType<object> | null = null;
let teamCenterDetailScreen: ComponentType<object> | null = null;
let messagesHubScreen: ComponentType<object> | null = null;
let scanScreen: ComponentType<object> | null = null;

function PersonalCenterRoute(props: object) {
  if (!personalCenterScreen) {
    personalCenterScreen = require('@/scenes/profile/PersonalCenterScene')
      .PersonalCenterScene as ComponentType<object>;
  }
  const Screen = personalCenterScreen;
  return <Screen {...props} />;
}

function TeamCenterDetailRoute(props: object) {
  if (!teamCenterDetailScreen) {
    teamCenterDetailScreen = require('@/scenes/team/TeamCenterDetailScene')
      .TeamCenterDetailScene as ComponentType<object>;
  }
  const Screen = teamCenterDetailScreen;
  return <Screen {...props} />;
}

function TeamCenterRoute(props: object) {
  if (!teamCenterScreen) {
    teamCenterScreen = require('@/scenes/team/TeamCenterScene')
      .TeamCenterScene as ComponentType<object>;
  }
  const Screen = teamCenterScreen;
  return <Screen {...props} />;
}

function MessagesHubRoute(props: object) {
  if (!messagesHubScreen) {
    messagesHubScreen = require('@/scenes/messages/MessagesHubScene')
      .MessagesHubScene as ComponentType<object>;
  }
  const Screen = messagesHubScreen;
  return <Screen {...props} />;
}

function ScanRoute(props: object) {
  if (!scanScreen) {
    scanScreen = require('@/scenes/scan/ScanScene').ScanScene as ComponentType<object>;
  }
  const Screen = scanScreen;
  return <Screen {...props} />;
}

export function HomeStackNavigator() {
  const personalCenterOptions = usePersonalCenterScreenOptions();
  const teamCenterOptions = useTeamCenterScreenOptions();
  const teamCenterDetailOptions = useTeamCenterDetailScreenOptions();
  const messagesOptions = useMessagesScreenOptions();
  const messagesCategoryOptions = useMessagesCategoryScreenOptions();
  const scanOptions = useScanScreenOptions();
  const screenOptions = useCregisStackScreenOptions();

  return (
    <Stack.Navigator
      {...edsPageStackNavigatorExtraProps()}
      screenOptions={screenOptions}
    >
      <Stack.Screen name="HomeMain" component={HomeMainScreen} />
      <Stack.Screen
        name="PersonalCenter"
        component={PersonalCenterRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...personalCenterOptions,
        })}
      />
      <Stack.Screen
        name="TeamCenter"
        component={TeamCenterRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterOptions(props),
        })}
      />
      <Stack.Screen
        name="TeamCenterDetail"
        component={TeamCenterDetailRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...teamCenterDetailOptions(props),
        })}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesHubRoute}
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
        component={ScanRoute}
        options={scanOptions}
      />
    </Stack.Navigator>
  );
}