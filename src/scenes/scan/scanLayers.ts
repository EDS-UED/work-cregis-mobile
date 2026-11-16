import { Platform } from 'react-native';

/** 扫码全屏 · 分层 zIndex / elevation（RN 栈下 `CameraView` 原生面易盖住兄弟节点）。 */
export const SCAN_LAYER_CAMERA = 0;
export const SCAN_LAYER_CHROME = 12;
export const SCAN_LAYER_TOP_BAR = 24;

export function scanLayerSurface(zIndex: number) {
  return {
    zIndex,
    ...(Platform.OS === 'android' ? { elevation: zIndex } : null),
  };
}