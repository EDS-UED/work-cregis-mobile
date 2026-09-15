import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrowserPreviewShell } from './browser-preview/BrowserPreviewShell';
import { AppProviders } from './src/providers/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppShell() {
  return (
    <View style={styles.appRoot}>
      <RootNavigator />
    </View>
  );
}

export default function App() {
  const app = (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );

  if (Platform.OS === 'web') {
    return (
      <GestureHandlerRootView style={styles.root}>
        <BrowserPreviewShell>{app}</BrowserPreviewShell>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>{app}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appRoot: { flex: 1 },
});
