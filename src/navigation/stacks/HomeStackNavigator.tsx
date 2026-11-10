import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { ComponentType } from "react";
import { HomeScene } from "@/scenes/home/HomeScene";
import { useHomeMainScreenOptions } from "@/scenes/home/useHomeMainScreenOptions";
import { usePersonalCenterScreenOptions } from "@/scenes/profile/usePersonalCenterScreenOptions";
import { useCregisNativeStackScreenOptions } from "@/navigation/screenOptions/useCregisNativeStackScreenOptions";
import type { HomeStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

let personalCenterScreen: ComponentType<object> | null = null;

function PersonalCenterRoute(props: object) {
  if (!personalCenterScreen) {
    personalCenterScreen = require("@/scenes/profile/PersonalCenterScene")
      .PersonalCenterScene as ComponentType<object>;
  }
  const Screen = personalCenterScreen;
  return <Screen {...props} />;
}

export function HomeStackNavigator() {
  const homeMainOptions = useHomeMainScreenOptions();
  const personalCenterOptions = usePersonalCenterScreenOptions();
  const screenOptions = useCregisNativeStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScene}
        options={(props) => ({
          ...screenOptions(props),
          ...homeMainOptions,
        })}
      />
      <Stack.Screen
        name="PersonalCenter"
        component={PersonalCenterRoute}
        options={(props) => ({
          ...screenOptions(props),
          ...personalCenterOptions,
        })}
      />
    </Stack.Navigator>
  );
}
