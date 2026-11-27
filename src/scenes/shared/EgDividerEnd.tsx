import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { egDividerEndDotSize, egDividerEndGap } from '@/scenes/shared/egDividerEndMetrics';
import { edsPx } from '@/utils/edsTheme';

function strokeXsLayoutThickness(specPx: number): number {
  const hairline = StyleSheet.hairlineWidth;
  return specPx > 0 && specPx < hairline ? hairline : specPx;
}

/**
 * `EgDivider` 场景化尾分 · 左线 + `stroke-divider-deep` 圆点 + 右线（订阅稿根分同源）。
 */
export function EgDividerEnd() {
  const { colors, spacing } = useEdsTheme();
  const lineColor = String(colors['stroke-divider-deep']);
  const dotSize = egDividerEndDotSize(spacing);
  const gap = egDividerEndGap(spacing);
  const thickness = strokeXsLayoutThickness(edsPx(spacing['stroke-xs']));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap,
        },
        line: {
          flex: 1,
          height: thickness,
          backgroundColor: lineColor,
        },
        dot: {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: lineColor,
        },
      }),
    [dotSize, gap, lineColor, thickness],
  );

  return (
    <View style={styles.row} accessibilityRole="none" importantForAccessibility="no">
      <View style={styles.line} />
      <View style={styles.dot} />
      <View style={styles.line} />
    </View>
  );
}