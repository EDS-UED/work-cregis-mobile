import type { ConfigContext, ExpoConfig } from 'expo/config';

const baseUrl = process.env.EXPO_BASE_URL ?? '';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'cregis',
  slug: 'cregis',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'cregis',
  newArchEnabled: true,
  experiments: {
    baseUrl,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cregis.app',
    infoPlist: {
      NSFaceIDUsageDescription:
        'Cregis uses Face ID to secure your account and authorize transactions.',
    },
  },
  android: {
    package: 'com.cregis.app',
    adaptiveIcon: {
      backgroundColor: '#5f2243',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: ['expo-secure-store', 'expo-local-authentication'],
});
