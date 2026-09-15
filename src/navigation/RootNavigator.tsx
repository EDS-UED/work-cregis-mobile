import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { RootTabNavigator } from '@/navigation/RootTabNavigator';
import { useEffectiveThemeMode } from '@/hooks/useEffectiveTheme';

export function RootNavigator() {
  const mode = useEffectiveThemeMode();

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootTabNavigator />
    </NavigationContainer>
  );
}
