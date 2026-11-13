import { Easing, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const AMBIENT_EPOCH = Date.now();

/**
 * 套餐卡装饰动效共用时钟 · 0→1 线性循环，相位按同一起点对齐：
 * 任意两个卡面实例（列表原位 / page-shot `morph` 副本）同一时刻画面一致。
 */
export function teamPlanAmbientClock(cycleMs: number, offsetMs = 0) {
  const phase = ((Date.now() - AMBIENT_EPOCH + offsetMs) % cycleMs) / cycleMs;
  const animation = withSequence(
    withTiming(1, { duration: (1 - phase) * cycleMs, easing: Easing.linear }),
    withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: cycleMs, easing: Easing.linear }),
      ),
      -1,
      false,
    ),
  );
  return { phase, animation };
}
