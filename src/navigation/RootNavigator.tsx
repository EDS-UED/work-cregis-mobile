import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GlassBlurScope } from '@eds-evergreen/mobile';

import { RootTabNavigator } from '@/navigation/RootTabNavigator';
import { useEffectiveThemeMode } from '@/hooks/useEffectiveTheme';
import { createEdsNavigationTheme } from '@/utils/edsTheme';

export function RootNavigator() {
  const mode = useEffectiveThemeMode();

  return (
    <GlassBlurScope>
      <NavigationContainer theme={createEdsNavigationTheme(mode)}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <RootTabNavigator />
      </NavigationContainer>
    </GlassBlurScope>
  );
}
