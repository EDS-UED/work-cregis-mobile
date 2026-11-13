import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import mobileTheme from '@/eds/tokens';
import { teamPlanAmbientClock } from '@/scenes/team/teamPlanAmbientClock';
import { edsTimingEasingFn } from '@/utils/edsMotion';

const OPACITY = mobileTheme.motion.opacity as Record<string, number>;

/** 单次扫光时长；扫完后停 `HOLD_MS` 再从左侧重新开始（只走左 → 右）。 */
const SWEEP_MS = 2200;
const HOLD_MS = 2000;
const CYCLE_MS = SWEEP_MS + HOLD_MS;
const SWEEP_SHARE = SWEEP_MS / CYCLE_MS;
const sweepEasing = edsTimingEasingFn('ios-layout-deform-content-opacity');
/** 光带宽度占卡片宽度比例 / 倾角。 */
const BAND_WIDTH_RATIO = 0.85;
const BAND_TILT = '16deg';

/** 宽平台柔光：边缘 0 → 中段 30% 满强度平台 → 边缘 0。 */
function sheenGradientStops(soft: boolean): { offset: number; opacity: number }[] {
  const hidden = OPACITY['opacity-hidden'] ?? 0;
  const dim = OPACITY['opacity-page-dim'] ?? 0.2;
  const peak = soft
    ? (OPACITY['opacity-sheets-dim-floating'] ?? 0.4)
    : (OPACITY['opacity-visible'] ?? 1);
  return [
    { offset: 0, opacity: hidden },
    { offset: 0.15, opacity: dim },
    { offset: 0.35, opacity: peak },
    { offset: 0.65, opacity: peak },
    { offset: 0.85, opacity: dim },
    { offset: 1, opacity: hidden },
  ];
}

type TeamCenterPlanCardSheenProps = {
  width: number;
  height: number;
  /** `material-same-white-weaken`：浅色纯白、深色 12% 白，强度随模式自适应 */
  color: string;
  /** 非基础版：彩色底上扫光峰值压低（基础版保持满强度）。 */
  soft?: boolean;
};

/** 套餐卡扫光 · 倾斜柔光带左 → 右扫过，停 2s 循环；卡片 `overflow: hidden` 负责裁切。 */
export function TeamCenterPlanCardSheen({ width, height, color, soft = false }: TeamCenterPlanCardSheenProps) {
  const reduceMotion = useReducedMotion();
  const clock = useSharedValue(0);
  const active = !reduceMotion && width > 0 && height > 0;

  const bandWidth = Math.round(width * BAND_WIDTH_RATIO);
  const bandHeight = Math.round(height * 2);

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const { phase, animation } = teamPlanAmbientClock(CYCLE_MS);
    clock.value = phase;
    clock.value = animation;
    return () => cancelAnimation(clock);
  }, [active, clock]);

  const bandStyle = useAnimatedStyle(() => {
    const sweep = clock.value < SWEEP_SHARE ? sweepEasing(clock.value / SWEEP_SHARE) : 1;
    return {
      transform: [
        { translateX: interpolate(sweep, [0, 1], [0, width + bandWidth * 2]) },
        { rotate: BAND_TILT },
      ],
    };
  });

  if (!active) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.band,
        {
          width: bandWidth,
          height: bandHeight,
          top: (height - bandHeight) / 2,
          left: -bandWidth * 1.5,
        },
        bandStyle,
      ]}
    >
      <Svg width={bandWidth} height={bandHeight}>
        <Defs>
          <LinearGradient id="team-plan-sheen" x1="0" y1="0" x2="1" y2="0">
            {sheenGradientStops(soft).map((stop) => (
              <Stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={color}
                stopOpacity={stop.opacity}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width={bandWidth} height={bandHeight} fill="url(#team-plan-sheen)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
  },
});
