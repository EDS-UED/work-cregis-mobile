export type ThemePreference = 'light' | 'dark' | 'system';

export type LocaleCode = 'zh-CN' | 'en-US' | 'zh-TW';

export type CurrencyUnit = 'CNY' | 'USD' | 'HKD';

export type TabRouteName = 'Home' | 'Wallet' | 'Collaboration' | 'TransactionRecords';

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
