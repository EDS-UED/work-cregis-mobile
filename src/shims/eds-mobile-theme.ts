/** Metro 入口 — 避免 `dist/index.js` 全量 re-export。 */
export {
  getThemeColors,
  getThemeColorBaseP3,
  getThemeSpacing,
  mobileTheme,
  resolveThemeMode,
  edsBrandColorValue,
  edsColorFromDisplayP3,
  type EdsDisplayP3ColorObject,
  type EdsDisplayP3Components,
  type MobileTheme,
  type ThemeMode,
} from '../../node_modules/@eds-evergreen/mobile/dist/components/theme/index.js';
