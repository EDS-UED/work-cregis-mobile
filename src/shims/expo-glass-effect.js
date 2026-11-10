/**
 * iOS · Expo Go：`isLiquidGlassAvailable()` 针对宿主二进制，常为 false，EDS `EgButtonGlass` 会误走 RN `glass-button-box`。
 * 运行时闸门与 `isGlassEffectAPIAvailable()` 对齐（expo #40911）；Dev Client 行为一致。
 */
export { default as GlassView } from '../../node_modules/expo-glass-effect/build/GlassView';
export { default as GlassContainer } from '../../node_modules/expo-glass-effect/build/GlassContainer';
export { isGlassEffectAPIAvailable } from '../../node_modules/expo-glass-effect/build/isGlassEffectAPIAvailable';

import { isGlassEffectAPIAvailable } from '../../node_modules/expo-glass-effect/build/isGlassEffectAPIAvailable';

export function isLiquidGlassAvailable() {
  try {
    return isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}
