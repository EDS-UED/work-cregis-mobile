import './src/polyfills/queueMicrotask';
import './src/utils/edsInstallIosDisplayP3ProcessColor';
import './src/utils/edsInstallCregisGetThemeColors';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
