import type { StackNavigationOptions } from '@react-navigation/stack';

import { useCompareHomeSnapshotScreenOptions } from '@/scenes/compare/shared/useCompareHomeSnapshotScreenOptions';

/** 对比 · 主页-待办卡片 — iOS 26+ 系统 Nav + scroll edge；RN 栈 overlay 顶栏。 */
export function useCompareHomeTodoCardScreenOptions(): StackNavigationOptions {
  return useCompareHomeSnapshotScreenOptions();
}