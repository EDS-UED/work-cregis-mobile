/**
 * RN `processColor` 只识别 PlatformColor / hex，会把 `{ space: 'display-p3' }` 变成 null。
 * Fabric 原生侧支持 display-p3 字典 — 在首屏前透传（module interop 兼容 default / 直接函数）。
 */
import { Platform } from 'react-native';

function isDisplayP3ColorObject(
  color: unknown,
): color is { space: 'display-p3'; r: number; g: number; b: number; a: number } {
  return (
    color != null &&
    typeof color === 'object' &&
    !Array.isArray(color) &&
    'space' in color &&
    (color as { space: string }).space === 'display-p3' &&
    'r' in color &&
    'g' in color &&
    'b' in color &&
    'a' in color
  );
}

function resolveProcessColorFn(mod: unknown): ((color?: unknown) => unknown) | null {
  if (typeof mod === 'function') {
    return mod as (color?: unknown) => unknown;
  }
  if (mod != null && typeof mod === 'object') {
    const record = mod as { default?: unknown };
    if (typeof record.default === 'function') {
      return record.default as (color?: unknown) => unknown;
    }
  }
  return null;
}

if (Platform.OS === 'ios') {
  const processColorModule = require('react-native/Libraries/StyleSheet/processColor');
  const originalProcessColor = resolveProcessColorFn(processColorModule);

  if (originalProcessColor) {
    const edsProcessColorWithDisplayP3Passthrough = (color?: unknown) => {
      if (isDisplayP3ColorObject(color)) {
        return color;
      }
      return originalProcessColor(color);
    };

    if (typeof processColorModule === 'function') {
      // Metro 偶发把模块本身当函数导出 — 无法替换，仅尽量 patch styleAttributes
    } else if (processColorModule && typeof processColorModule === 'object') {
      (processColorModule as { default: unknown }).default =
        edsProcessColorWithDisplayP3Passthrough;
    }

    try {
      const styleAttributes = require('react-native/Libraries/Components/View/ReactNativeStyleAttributes');
      const attr = styleAttributes.colorAttribute;
      if (attr && typeof attr === 'object' && typeof attr.process === 'function') {
        attr.process = edsProcessColorWithDisplayP3Passthrough;
      }
    } catch {
      /* styleAttributes 未就绪时忽略 */
    }
  }
}
