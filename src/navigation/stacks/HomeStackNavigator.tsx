import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { shouldUseEgNavBarNativeStack } from "@eds-evergreen/mobile";

import { HomeScene } from "@/scenes/home/HomeScene";
import { useHomeNativeHeaderOptions } from "@/scenes/home/HomeTopBar";
import { useCregisNativeStackScreenOptions } from "@/navigation/screenOptions/useCregisNativeStackScreenOptions";
import type { HomeStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  const homeNativeHeaderOptions = useHomeNativeHeaderOptions();
  const screenOptions = useCregisNativeStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScene}
        options={
          shouldUseEgNavBarNativeStack()
            ? (props) => ({
                ...screenOptions(props),
                ...homeNativeHeaderOptions,
              })
            : undefined
        }
      />
    </Stack.Navigator>
  );
}
