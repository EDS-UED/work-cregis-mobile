import type { ColorValue } from 'react-native';

/** Cregis 品牌主色 — 与 Figma `eds-success` / `#1FC35A` 同源。 */
export const CREGIS_BRAND_COLOR = '#1FC35A';

/**
 * Figma base `displayP3` for `#1FC35A`。
 * 勿写入 `mobileTheme.colors` / `getThemeColors` — Eg* `resolveColor` 只吃 string；
 * Scene 需要真 P3 时用 `edsBrandColorValue` + 已安装的 processColor 透传。
 */
export const CREGIS_BRAND_DISPLAY_P3 = [0.1216, 0.7647, 0.3529] as const;

type BrandColorRecord = Record<string, string | ColorValue>;

function brandHex(alpha = 1): string {
  if (alpha >= 1) {
    return CREGIS_BRAND_COLOR;
  }
  const alphaByte = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${CREGIS_BRAND_COLOR}${alphaByte}`;
}

/** 将 EDS semantic 中的 brand 族替换为 Cregis 品牌色（Eg* / mobileTheme 共用 · 始终 hex）。 */
export function applyCregisBrandColors<T extends BrandColorRecord>(colors: T): T {
  return {
    ...colors,
    brand: brandHex(1) as T['brand'],
    'text-brand': brandHex(1) as T['text-brand'],
    'material-brand': brandHex(1) as T['material-brand'],
    'material-brand-weaken': brandHex(0.12) as T['material-brand-weaken'],
    'stroke-color-brand': brandHex(1) as T['stroke-color-brand'],
    'status-disable-brand': brandHex(0.4) as T['status-disable-brand'],
    'status-disable-brand-weaken': brandHex(0.2) as T['status-disable-brand-weaken'],
    'event-tap-brand': brandHex(0.4) as T['event-tap-brand'],
    'event-focus-brand': brandHex(0.12) as T['event-focus-brand'],
  };
}
