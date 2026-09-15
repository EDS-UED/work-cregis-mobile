export type ThemePreference = 'light' | 'dark' | 'system';

export type LocaleCode = 'zh-CN' | 'en-US' | 'zh-TW';

export type PreviewMode = 'preview' | 'inspect';

export type DevicePresetId =
  | 'iphone'
  | 'iphone-pro'
  | 'iphone-pro-max'
  | 'android'
  | 'android-small';

export type TabRouteName = 'Home' | 'Collaboration' | 'Assets' | 'Waas' | 'Profile';

export type MotionScene =
  | 'motion-page'
  | 'motion-flotation'
  | 'motion-layout'
  | 'motion-deform'
  | 'motion-layout-deform'
  | 'motion-none';

export type MotionPresetKey =
  | 'spring.default'
  | 'spring.snappy'
  | 'spring.gentle'
  | 'spring.bouncy'
  | 'timing.navigationPush'
  | 'timing.easeInOut'
  | 'timing.easeOut'
  | 'timing.easeIn';
