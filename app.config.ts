import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Expo Go 部分版本未内置 `ExpoFetchModule`；SDK 58 默认 `expo/fetch` 会在启动时报错。
 * 使用 RN 自带 fetch（与 EDS 业务 fetch 无关，仅避免红屏）。
 */
process.env.EXPO_PUBLIC_USE_RN_FETCH ??= '1';

const baseUrl = process.env.EXPO_BASE_URL ?? '';

/** Cregis UED · @theyangsongs-team/eds-ued — https://expo.dev/accounts/theyangsongs-team/projects/eds-ued */
const easProjectId =
  process.env.EAS_PROJECT_ID ?? '6ac19714-fbe5-4de6-ab92-ea1bb47a0ff5';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Cregis UED',
  slug: 'eds-ued',
  owner: 'theyangsongs-team',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'eds-ued',
  ...(easProjectId
    ? {
        runtimeVersion: {
          policy: 'sdkVersion',
        },
        updates: {
          url: `https://u.expo.dev/${easProjectId}`,
        },
        extra: {
          ...(config.extra ?? {}),
          eas: {
            projectId: easProjectId,
          },
        },
      }
    : {}),
  experiments: {
    baseUrl,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cregis.app',
    infoPlist: {
      NSFaceIDUsageDescription:
        'Cregis uses Face ID to secure your account and authorize transactions.',
      NSCameraUsageDescription:
        'Cregis needs camera access to scan QR codes for transfers.',
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
  plugins: [
    'expo-asset',
    'expo-font',
    'expo-status-bar',
    'expo-secure-store',
    'expo-local-authentication',
    [
      'expo-camera',
      {
        cameraPermission:
          'Cregis needs camera access to scan QR codes for transfers.',
        recordAudioAndroid: false,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Cregis needs access to your photo library to scan QR codes from images.',
      },
    ],
  ],
});
