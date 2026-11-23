import * as Haptics from 'expo-haptics';

/** 长按进入拖拽排序 · 与 `activateAfterLongPress(260)` 对齐的触感反馈。 */
export function edsHapticDragReorderLift() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** 拖拽经过槽位并触发换位时的轻触感。 */
export function edsHapticDragReorderSelection() {
  void Haptics.selectionAsync();
}