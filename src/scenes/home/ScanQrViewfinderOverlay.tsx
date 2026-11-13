import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useThemeColors } from '@/hooks/useEffectiveTheme';

type ScanQrViewfinderOverlayProps = {
  size: number;
};

/** 角标沿边长度（更短）· 线宽（更粗）· 拐角圆角（更大）与磨砂镂空一致。 */
const CORNER_LEN_RATIO = 0.1;
export const SCAN_VIEWFINDER_CORNER_RADIUS = 16;
export const SCAN_VIEWFINDER_STROKE = 7;
const CORNER_RADIUS = SCAN_VIEWFINDER_CORNER_RADIUS;

function cornerPath(corner: 'tl' | 'tr' | 'bl' | 'br', size: number, len: number) {
  const a = SCAN_VIEWFINDER_STROKE / 2;
  const b = size - a;
  const r = CORNER_RADIUS;
  switch (corner) {
    case 'tl':
      return `M ${a} ${a + len} L ${a} ${a + r} Q ${a} ${a} ${a + r} ${a} L ${a + len} ${a}`;
    case 'tr':
      return `M ${b - len} ${a} L ${b - r} ${a} Q ${b} ${a} ${b} ${a + r} L ${b} ${a + len}`;
    case 'bl':
      return `M ${a} ${b - len} L ${a} ${b - r} Q ${a} ${b} ${a + r} ${b} L ${a + len} ${b}`;
    case 'br':
      return `M ${b - len} ${b} L ${b - r} ${b} Q ${b} ${b} ${b} ${b - r} L ${b} ${b - len}`;
  }
}

/** 扫码圆角 L 角标 · 叠在相机预览上。 */
export function ScanQrViewfinderOverlay({ size }: ScanQrViewfinderOverlayProps) {
  const colors = useThemeColors();
  const cornerLen = size * CORNER_LEN_RATIO;
  const strokeColor = String(colors['text-same-white']);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={size} height={size}>
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
          <Path
            key={c}
            d={cornerPath(c, size, cornerLen)}
            stroke={strokeColor}
            strokeWidth={SCAN_VIEWFINDER_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}
