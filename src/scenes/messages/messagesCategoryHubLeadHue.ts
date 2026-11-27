import type { MessageCategory } from '@/scenes/messages/messagesMock';
import type { ThemeMode } from '@/eds/theme';

/** Palette · Hue — 与 `eds-mobile/packages/tokens/spec/color/palette/hue.json`（`--eds-hue-*`）一致。 */
export type MessageHubLeadHueId =
  | 'hue-green-dim'
  | 'hue-green'
  | 'hue-orange'
  | 'hue-blue'
  | 'hue-blue-dim';

/** RN `getThemeColors` 键（dist 未导出时走 `HUE_HEX` 兜底）。 */
const EDS_HUE_THEME_KEY: Record<MessageHubLeadHueId, string> = {
  'hue-green-dim': 'eds-hue-green-dim',
  'hue-green': 'eds-hue-green',
  'hue-orange': 'eds-hue-orange',
  'hue-blue': 'eds-hue-blue',
  'hue-blue-dim': 'eds-hue-blue-dim',
};

/** 前置五类行首底色。 */
export const MESSAGE_HUB_LEAD_HUE_BY_CATEGORY: Record<MessageCategory, MessageHubLeadHueId> = {
  transaction: 'hue-green-dim',
  collaboration: 'hue-green',
  amlAlert: 'hue-orange',
  teamActivity: 'hue-blue',
  announcement: 'hue-blue-dim',
};

const HUE_HEX: Record<MessageHubLeadHueId, { light: string; dark: string }> = {
  'hue-green-dim': { light: '#064a26', dark: '#ffffff' },
  'hue-green': { light: '#1fc35a', dark: '#1fc35a' },
  'hue-orange': { light: '#f55e24', dark: '#f37a4b' },
  'hue-blue': { light: '#0072c3', dark: '#258fd9' },
  'hue-blue-dim': { light: '#003b6e', dark: '#335e82' },
};

export function messageHubLeadHueShellHex(
  hueId: MessageHubLeadHueId,
  mode: ThemeMode,
  colors?: Record<string, unknown>,
): string {
  const themeKey = EDS_HUE_THEME_KEY[hueId];
  const fromTheme = colors?.[themeKey];
  if (fromTheme != null && String(fromTheme).length > 0) {
    return String(fromTheme);
  }
  return HUE_HEX[hueId][mode];
}

/** 浅壳（暗色 `eds-hue-green-dim` → `#fff`）用深描边；饱和 Hue 底用 `stroke-same-white`。 */
export function messageHubLeadHueUsesLightGlyph(
  hueId: MessageHubLeadHueId,
  mode: ThemeMode,
): boolean {
  return hueId === 'hue-green-dim' && mode === 'dark';
}