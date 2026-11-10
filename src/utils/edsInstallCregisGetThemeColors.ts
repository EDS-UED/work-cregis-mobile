/**
 * Eg*（含 TabBar）内部读 `getThemeColors` → `mobileTheme.colors[mode]`。
 * 启动时把 Cregis brand hex 写进 theme（勿写 P3 对象 — resolveColor 会崩）。
 */
import mobileTheme from '@/eds/tokens';

import { applyCregisBrandColors } from '@/utils/cregisBrandColors';

for (const mode of ['light', 'dark'] as const) {
  const next = applyCregisBrandColors(mobileTheme.colors[mode]);
  Object.assign(mobileTheme.colors[mode], next);
}
