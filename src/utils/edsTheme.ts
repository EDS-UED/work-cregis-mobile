import { getThemeColors, mobileTheme } from '@eds-evergreen/mobile';
import type { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

type ThemeColors = ReturnType<typeof getThemeColors>;
type Typography = typeof mobileTheme.typography.base;
type FontWeightKey = 'weight-regular' | 'weight-medium' | 'weight-semibold' | 'weight-bold';

/** EDS motion/base.json opacity tokens. */
export const EDS_MOTION_OPACITY = {
  hidden: 0,
  dim: 0.4,
  subtle: 0.7,
  visible: 1,
} as const;

/** EDS spacing / typography 数值 → px（来自 @eds-evergreen/mobile）。 */
export function edsPx(value: string | number) {
  return typeof value === 'number' ? value : Number.parseFloat(value);
}

/** 业务 Scene 默认水平内容边距 — `spacing-6`（24）。 */
export const EDS_SCENE_CONTENT_INSET = 'spacing-6' as const;

export function edsSceneContentInset(spacing: typeof mobileTheme.spacing) {
  return edsPx(spacing[EDS_SCENE_CONTENT_INSET]);
}

/** `EgNavBar` 水平 padding — `spacing-4`（16），与 `EG_NAV_BAR_PADDING_HORIZONTAL` 一致。 */
export const EDS_NAV_BAR_HORIZONTAL_INSET = 'spacing-4' as const;

export function edsNavBarHorizontalInset(spacing: typeof mobileTheme.spacing) {
  return edsPx(spacing[EDS_NAV_BAR_HORIZONTAL_INSET]);
}

/** Cregis 品牌主色 — 浅色 / 深色均为 `#1FC35A`（覆盖 EDS 默认 `brand` 族 token）。 */
export const CREGIS_BRAND_COLOR = '#1FC35A';

/** 将 EDS `getThemeColors` 结果中的 brand 相关 semantic 替换为 Cregis 品牌色。 */
export function applyCregisBrandColors(colors: ThemeColors): ThemeColors {
  const brand = CREGIS_BRAND_COLOR;
  return {
    ...colors,
    brand,
    'text-brand': brand,
    'material-brand': brand,
    'material-brand-weaken': `${brand}1f`,
    'stroke-color-brand': brand,
    'status-disable-brand': `${brand}66`,
    'status-disable-brand-weaken': `${brand}33`,
    'event-tap-brand': `${brand}66`,
    'event-focus-brand': `${brand}1a`,
  };
}

export function getCregisThemeColors(mode: 'light' | 'dark'): ThemeColors {
  return applyCregisBrandColors(getThemeColors(mode));
}

/** 页面背景 — 与 CSS `var(--box-page)` 同源 token `box-page`。 */
export const EDS_PAGE_BACKGROUND = 'box-page' as const;

export function edsPageBackground(colors: ThemeColors) {
  return String(colors[EDS_PAGE_BACKGROUND]);
}

export function edsFontWeight(typography: Typography, weight: FontWeightKey) {
  return String(typography[weight]) as '400' | '500' | '600' | '700';
}

/** RN  bundled 字重 — 每档独立 `EDSText-*` face（与 eds-mobile `edsFontStyle` 一致）。 */
export function edsNativeFontFamily(typography: Typography, weight: FontWeightKey) {
  const numeric = edsFontWeight(typography, weight);
  const face =
    mobileTheme.fonts.sans.weights[numeric] ?? mobileTheme.fonts.sans.weights['400'];
  return String(face);
}

function edsTextStyle(
  typography: Typography,
  colors: ThemeColors,
  size: keyof Typography,
  lineHeight: keyof Typography,
  weight: FontWeightKey,
  color: keyof ThemeColors,
) {
  const fontFamily = edsNativeFontFamily(typography, weight);
  const fontWeight = edsFontWeight(typography, weight);
  return {
    fontFamily,
    fontSize: edsPx(typography[size]),
    lineHeight: edsPx(typography[lineHeight]),
    ...(Platform.OS === 'android' ? {} : { fontWeight }),
    color: String(colors[color]),
  };
}

export function createEdsTypographyStyles(
  colors: ThemeColors,
  typography: Typography = mobileTheme.typography.base,
) {
  return {
    display: edsTextStyle(
      typography,
      colors,
      'size-display',
      'line-height-display',
      'weight-bold',
      'text-base-primary',
    ),
    headline: edsTextStyle(
      typography,
      colors,
      'size-headline',
      'line-height-headline',
      'weight-bold',
      'text-base-primary',
    ),
    title: edsTextStyle(
      typography,
      colors,
      'size-title',
      'line-height-title',
      'weight-semibold',
      'text-base-primary',
    ),
    body: edsTextStyle(
      typography,
      colors,
      'size-body-medium',
      'line-height-body-medium',
      'weight-regular',
      'text-base-primary',
    ),
    bodyLarge: edsTextStyle(
      typography,
      colors,
      'size-body-large',
      'line-height-body-large',
      'weight-regular',
      'text-base-primary',
    ),
    bodyLargeSemibold: edsTextStyle(
      typography,
      colors,
      'size-body-large',
      'line-height-body-large',
      'weight-semibold',
      'text-base-primary',
    ),
    bodyMedium: edsTextStyle(
      typography,
      colors,
      'size-body-medium',
      'line-height-body-medium',
      'weight-medium',
      'text-base-primary',
    ),
    bodySemibold: edsTextStyle(
      typography,
      colors,
      'size-body-medium',
      'line-height-body-medium',
      'weight-semibold',
      'text-base-primary',
    ),
    detail: edsTextStyle(
      typography,
      colors,
      'size-detail',
      'line-height-detail',
      'weight-regular',
      'text-base-primary',
    ),
    footnote: edsTextStyle(
      typography,
      colors,
      'size-footnote',
      'line-height-footnote',
      'weight-regular',
      'text-base-secondary',
    ),
    bodySmall: edsTextStyle(
      typography,
      colors,
      'size-body-small',
      'line-height-body-small',
      'weight-regular',
      'text-base-primary',
    ),
    bodySmallTertiary: edsTextStyle(
      typography,
      colors,
      'size-body-small',
      'line-height-body-small',
      'weight-regular',
      'text-base-tertiary',
    ),
    bodySmallSecondary: edsTextStyle(
      typography,
      colors,
      'size-body-small',
      'line-height-body-small',
      'weight-regular',
      'text-base-secondary',
    ),
    bodySmallMedium: edsTextStyle(
      typography,
      colors,
      'size-body-small',
      'line-height-body-small',
      'weight-medium',
      'text-base-primary',
    ),
    bodySmallSemibold: edsTextStyle(
      typography,
      colors,
      'size-body-small',
      'line-height-body-small',
      'weight-semibold',
      'text-base-primary',
    ),
    bar: edsTextStyle(typography, colors, 'size-bar', 'line-height-bar', 'weight-medium', 'text-base-secondary'),
    brand: {
      ...edsTextStyle(
        typography,
        colors,
        'size-body-medium',
        'line-height-body-medium',
        'weight-medium',
        'text-base-primary',
      ),
      color: String(colors.brand),
    },
    secondary: {
      ...edsTextStyle(
        typography,
        colors,
        'size-body-medium',
        'line-height-body-medium',
        'weight-regular',
        'text-base-primary',
      ),
      color: String(colors['text-base-secondary']),
    },
    tertiary: {
      ...edsTextStyle(
        typography,
        colors,
        'size-body-medium',
        'line-height-body-medium',
        'weight-regular',
        'text-base-primary',
      ),
      color: String(colors['text-base-tertiary']),
    },
  } as const;
}

export type EdsTypographyStyles = ReturnType<typeof createEdsTypographyStyles>;
export type EdsTextVariant = keyof EdsTypographyStyles;

export function createEdsNavigationTheme(mode: 'light' | 'dark'): Theme {
  const colors = getCregisThemeColors(mode);
  const typography = mobileTheme.typography.base;

  return {
    dark: mode === 'dark',
    colors: {
      primary: String(colors.brand),
      background: edsPageBackground(colors),
      card: edsPageBackground(colors),
      text: String(colors['text-base-primary']),
      border: String(colors['stroke-divider']),
      notification: String(colors.danger),
    },
    fonts:
      Platform.OS === 'android'
        ? {
            regular: { fontFamily: edsNativeFontFamily(typography, 'weight-regular'), fontWeight: '400' },
            medium: { fontFamily: edsNativeFontFamily(typography, 'weight-medium'), fontWeight: '500' },
            bold: { fontFamily: edsNativeFontFamily(typography, 'weight-semibold'), fontWeight: '600' },
            heavy: { fontFamily: edsNativeFontFamily(typography, 'weight-bold'), fontWeight: '700' },
          }
        : {
            regular: {
              fontFamily: edsNativeFontFamily(typography, 'weight-regular'),
              fontWeight: edsFontWeight(typography, 'weight-regular'),
            },
            medium: {
              fontFamily: edsNativeFontFamily(typography, 'weight-medium'),
              fontWeight: edsFontWeight(typography, 'weight-medium'),
            },
            bold: {
              fontFamily: edsNativeFontFamily(typography, 'weight-semibold'),
              fontWeight: edsFontWeight(typography, 'weight-semibold'),
            },
            heavy: {
              fontFamily: edsNativeFontFamily(typography, 'weight-bold'),
              fontWeight: edsFontWeight(typography, 'weight-bold'),
            },
          },
  };
}
