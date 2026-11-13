import { useCallback, useState } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithTimingConfig,
} from 'react-native-reanimated';
import {
  EdsRecipeAnima,
  EdsSemanticAnima,
  resolveMotionSpring,
  resolveMotionTiming,
} from '@/eds/animations';
import mobileTheme from '@/eds/tokens';
/** dist `mobileMotionTimings` 可能为空 — 与 work.md Stack Push 默认一致。 */
export const EDS_NAVIGATION_PUSH_DURATION_MS = 350;

const DEFAULT_PRESS_SPRING = {
  damping: 46,
  stiffness: 560,
  mass: 1,
} as const;

type MotionPressDownIntensity = 'xs' | 'sm' | 'md' | 'lg';

function edsSemanticPressSpringConfig() {
  try {
    const config = EdsSemanticAnima('press').springConfig;
    if (config) {
      return config;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PRESS_SPRING;
}

function edsPressDownScale(intensity: MotionPressDownIntensity = 'xs'): number {
  const scale = mobileTheme.motion.scale as Record<string, number>;
  const keyByIntensity: Record<MotionPressDownIntensity, string> = {
    xs: 'scale-press-down-xs',
    sm: 'scale-press-down-sm',
    md: 'scale-press-down-md',
    lg: 'scale-press-down-lg',
  };
  const key = keyByIntensity[intensity];
  const value = scale[key] ?? scale['scale-press-down-sm'];
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  const xs = scale['scale-press-xs'];
  if (typeof xs === 'number' && Number.isFinite(xs)) {
    return 2 - xs;
  }
  return 0.96;
}

function edsPressScaleOutSpringConfig() {
  try {
    const config = EdsRecipeAnima('press-scale-out').springConfig;
    if (config) {
      return config;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PRESS_SPRING;
}

/**
 * 点按 — `onPressIn`：`EdsSemanticAnima('press')`；
 * `onPressOut`：`EdsRecipeAnima('press-scale-out')`（与 `MotionPressable` 一致）。
 */
export function useEdsTapPressMotion(intensity: MotionPressDownIntensity = 'xs') {
  const [pressing, setPressing] = useState(false);
  const scale = useSharedValue(1);
  const activeScale = edsPressDownScale(intensity);
  const pressInSpring = edsSemanticPressSpringConfig();
  const pressOutSpring = edsPressScaleOutSpringConfig();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const onPressIn = useCallback(() => {
    setPressing(true);
    scale.value = withSpring(activeScale, pressInSpring);
  }, [activeScale, pressInSpring, scale]);

  const onPressOut = useCallback(() => {
    setPressing(false);
    scale.value = withSpring(1, pressOutSpring);
  }, [pressOutSpring, scale]);

  return { animatedStyle, onPressIn, onPressOut, pressing };
}

export function edsNavigationPushDurationMs(): number {
  try {
    const timing = resolveMotionTiming(
      'navigationPush' as Parameters<typeof resolveMotionTiming>[0],
    );
    const duration = (timing as { duration?: number } | undefined)?.duration;
    if (typeof duration === 'number') {
      return duration;
    }
  } catch {
    /* ignore */
  }
  return EDS_NAVIGATION_PUSH_DURATION_MS;
}

type EdsMotionTimingName =
  | 'ios-layout-deform-content-opacity'
  | 'ios-layout-deform-content-transform'
  | 'ios-sheets-dismiss';

function edsTimingBezier(name: EdsMotionTimingName): [number, number, number, number] | null {
  const timings = mobileTheme.motion.timings as Record<
    string,
    { easing?: string } | undefined
  >;
  const match = timings[name]?.easing?.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return null;
  const points = match[1]!.split(',').map(Number);
  return points.length === 4 && points.every((n) => Number.isFinite(n))
    ? (points as [number, number, number, number])
    : null;
}

/** `motion.timings[name].easing`（`cubic-bezier(...)`）→ Reanimated easing。 */
export function edsTimingEasing(
  name: EdsMotionTimingName,
): NonNullable<WithTimingConfig['easing']> {
  const points = edsTimingBezier(name);
  return points ? Easing.bezier(...points) : Easing.inOut(Easing.ease);
}

/** 同上 · 可在 worklet 内直接调用的曲线函数。 */
export function edsTimingEasingFn(name: EdsMotionTimingName): (x: number) => number {
  const points = edsTimingBezier(name);
  return points ? Easing.bezierFn(...points) : Easing.inOut(Easing.ease);
}

export function edsMotionSpring(name: 'press' | 'snappy' | 'press-release' | 'control' | 'drag') {
  try {
    const config = resolveMotionSpring(name);
    if (config) {
      return config;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PRESS_SPRING;
}
