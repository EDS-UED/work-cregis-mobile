import { createCregisPageStackNavigator } from "@/navigation/createCregisPageStackNavigator";

import type { ComponentType } from "react";
import { HomeMainScreen } from "@/scenes/home/HomeMainScreen";
import { usePersonalCenterScreenOptions } from "@/scenes/profile/usePersonalCenterScreenOptions";
import { useTeamCenterScreenOptions } from "@/scenes/team/useTeamCenterScreenOptions";
import { useMessagesScreenOptions } from "@/scenes/messages/useMessagesScreenOptions";
import { useScanScreenOptions } from "@/scenes/scan/useScanScreenOptions";
import { edsPageStackNavigatorExtraProps } from "@/navigation/screenOptions/edsPageStackNavigatorConfig";
import { useCregisStackScreenOptions } from "@/navigation/screenOptions/useCregisStackScreenOptions";
import type { HomeStackParamList } from "@/navigation/types";

const Stack = createCregisPageStackNavigator<HomeStackParamList>();

let personalCenterScreen: ComponentType<object> | null = null;
let teamCenterScreen: ComponentType<object> | null = null;
let messagesScreen: ComponentType<object> | null = null;
let scanScreen: ComponentType<object> | null = null;

function PersonalCenterRoute(props: object) {
  if (!personalCenterScreen) {
    personalCenterScreen = require("@/scenes/profile/PersonalCenterScene")
      .PersonalCenterScene as ComponentType<object>;
  }
  const Screen = personalCenterScreen;
  return <Screen {...props} />;
}

function TeamCenterRoute(props: object) {
  if (!teamCenterScreen) {
    teamCenterScreen = require("@/scenes/team/TeamCenterScene")
      .TeamCenterScene as ComponentType<object>;
  }
  const Screen = teamCenterScreen;
  return <Screen {...props} />;
}

function MessagesRoute(props: object) {
  if (!messagesScreen) {
    messagesScreen = require("@/scenes/messages/MessagesScene")
      .MessagesScene as ComponentType<object>;
  }
  const Screen = messagesScreen;
  return <Screen {...props} />;
}

function ScanRoute(props: object) {
  if (!scanScreen) {
    scanScreen = require("@/scenes/scan/ScanScene").ScanScene as ComponentType<object>;
  }
  const Screen = scanScreen;
  return <Screen {...props} />;
}

export function HomeStackNavigator() {
  const personalCenterOptions = usePersonalCenterScreenOptions();
  const teamCenterOptions = useTeamCenterScreenOptions();
  const messagesOptions = useMessagesScreenOptions();
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
        name="Messages"
        component={MessagesRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...messagesOptions,
        })}
      />
      <Stack.Screen
        name="Scan"
        component={ScanRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...scanOptions,
        })}
      />
    </Stack.Navigator>
  );
}
