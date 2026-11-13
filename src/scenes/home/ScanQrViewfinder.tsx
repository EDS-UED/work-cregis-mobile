import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type ScanQrViewfinderProps = {
  size: number;
};

const CORNER_LEN_RATIO = 0.18;
const STROKE_WIDTH = 3;

function cornerPath(
  corner: 'tl' | 'tr' | 'bl' | 'br',
  size: number,
  len: number,
  stroke: number,
) {
  const inset = stroke / 2;
  const l = len;
  const s = size;
  switch (corner) {
    case 'tl':
      return `M ${inset} ${inset + l} L ${inset} ${inset} L ${inset + l} ${inset}`;
    case 'tr':
      return `M ${s - inset - l} ${inset} L ${s - inset} ${inset} L ${s - inset} ${inset + l}`;
    case 'bl':
      return `M ${inset} ${s - inset - l} L ${inset} ${s - inset} L ${inset + l} ${s - inset}`;
    case 'br':
      return `M ${s - inset - l} ${s - inset} L ${s - inset} ${s - inset} L ${s - inset} ${s - inset - l}`;
  }
}

/** 扫码取景框 · 深色预览区 + 白色 L 角标。 */
export function ScanQrViewfinder({ size }: ScanQrViewfinderProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const cornerLen = size * CORNER_LEN_RATIO;
  const strokeColor = String(colors['text-same-white']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: size,
          height: size,
          borderRadius: edsPx(spacing['radius-md']),
          backgroundColor: String(colors['material-card-moderate']),
          overflow: 'hidden',
        },
      }),
    [colors, size, spacing],
  );

  const corners = (['tl', 'tr', 'bl', 'br'] as const).map((c) => (
    <Path
      key={c}
      d={cornerPath(c, size, cornerLen, STROKE_WIDTH)}
      stroke={strokeColor}
      strokeWidth={STROKE_WIDTH}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ));

  return (
    <View style={styles.root}>
      <Svg width={size} height={size} pointerEvents="none">
        {corners}
      </Svg>
    </View>
  );
}
