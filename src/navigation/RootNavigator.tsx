import { CommonActions, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GlassBlurScope } from '@/eds/glass';

import { RootTabNavigator } from '@/navigation/RootTabNavigator';
import type { RootTabParamList } from '@/navigation/types';
import { SystemMessageSheet } from '@/scenes/home/SystemMessageSheet';
import { useEffectiveThemeMode } from '@/hooks/useEffectiveTheme';
import { createEdsNavigationTheme } from '@/utils/edsTheme';

export function RootNavigator() {
  const mode = useEffectiveThemeMode();
  const navigationRef = useNavigationContainerRef<RootTabParamList>();

  const returnHome = useCallback(() => {
    if (!navigationRef.isReady()) {
      return;
    }
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'Home',
        params: { screen: 'HomeMain' },
      }),
    );
  }, [navigationRef]);

  return (
    <GlassBlurScope>
      <NavigationContainer ref={navigationRef} theme={createEdsNavigationTheme(mode)}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <RootTabNavigator />
        <SystemMessageSheet onReturnHome={returnHome} />
      </NavigationContainer>
    </GlassBlurScope>
  );
}
