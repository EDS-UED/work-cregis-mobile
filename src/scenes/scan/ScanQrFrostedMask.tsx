import type { ComponentType, ReactElement } from 'react';
import { Platform, StyleSheet, UIManager, View, type ViewProps, type ViewStyle } from 'react-native';
import MaskedViewClass from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

import { useGlassBlurTargetRef } from '@/eds/glass';
import { useThemeColors } from '@/hooks/useEffectiveTheme';

type Rect = { left: number; top: number; width: number; height: number };

type ScanQrFrostedMaskProps = {
  windowWidth: number;
  windowHeight: number;
  /** 取景框外沿（角标描边外缘）。 */
  frame: Rect;
  /** 角标描边宽 · 圆角（与 `ScanQrViewfinderOverlay` 一致）。 */
  stroke: number;
  cornerRadius: number;
};

function insetRect({ left, top, width, height }: Rect, d: number): Rect {
  return { left: left + d, top: top + d, width: width - d * 2, height: height - d * 2 };
}

/** 库内类声明与 React 19 JSX 类型不兼容。 */
const MaskedView = MaskedViewClass as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

/** 未重编 dev client 时原生 MaskedView 不存在 → 回退四块拼接。 */
const hasNativeMask = UIManager.hasViewManagerConfig?.('RNCMaskedView') ?? false;

function FrostLayer({ style }: { style: ViewStyle }) {
  const colors = useThemeColors();
  const blurTarget = useGlassBlurTargetRef();

  const blurProps =
    Platform.OS === 'android' && blurTarget
      ? { blurTarget, blurMethod: 'dimezisBlurViewSdk31Plus' as const }
      : {};

  return (
    <View style={[style, styles.clip]} pointerEvents="none">
      <BlurView
        intensity={Platform.OS === 'ios' ? 90 : 60}
        tint="dark"
        style={StyleSheet.absoluteFill}
        {...blurProps}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: String(colors['material-same-black']),
            opacity: Platform.OS === 'android' ? 0.55 : 0.2,
          },
        ]}
      />
    </View>
  );
}

function holePath(w: number, h: number, { left, top, width, height }: Rect, r: number) {
  const right = left + width;
  const bottom = top + height;
  return [
    `M0 0H${w}V${h}H0Z`,
    `M${left + r} ${top}H${right - r}Q${right} ${top} ${right} ${top + r}`,
    `V${bottom - r}Q${right} ${bottom} ${right - r} ${bottom}`,
    `H${left + r}Q${left} ${bottom} ${left} ${bottom - r}`,
    `V${top + r}Q${left} ${top} ${left + r} ${top}Z`,
  ].join('');
}

/** 取景框外整块磨砂 · 中心镂空露出清晰相机。 */
export function ScanQrFrostedMask({
  windowWidth,
  windowHeight,
  frame,
  stroke,
  cornerRadius,
}: ScanQrFrostedMaskProps) {
  if (hasNativeMask) {
    const hole = insetRect(frame, stroke / 2);
    return (
      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <Svg width={windowWidth} height={windowHeight}>
            <Path
              d={holePath(windowWidth, windowHeight, hole, cornerRadius)}
              fill="#000"
              fillRule="evenodd"
            />
          </Svg>
        }
      >
        <FrostLayer style={StyleSheet.absoluteFill} />
      </MaskedView>
    );
  }

  // 直角孔内缩一整条描边，孔角才会落在圆角描边内被盖住。
  const { left, top, width, height } = insetRect(frame, stroke);
  const bottomTop = top + height;
  const rightLeft = left + width;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <FrostLayer style={{ position: 'absolute', left: 0, top: 0, width: windowWidth, height: top }} />
      <FrostLayer
        style={{
          position: 'absolute',
          left: 0,
          top: bottomTop,
          width: windowWidth,
          height: Math.max(0, windowHeight - bottomTop),
        }}
      />
      <FrostLayer style={{ position: 'absolute', left: 0, top, width: left, height }} />
      <FrostLayer
        style={{
          position: 'absolute',
          left: rightLeft,
          top,
          width: Math.max(0, windowWidth - rightLeft),
          height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
