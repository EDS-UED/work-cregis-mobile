import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  DL_PRESS_INTENSITY,
  getDataListRowLayout,
  type DataListRowLayout,
} from '@/scenes/shared/dataListLayout';
import { useEdsTapPressMotion } from '@/utils/edsMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type DataListRowProps = {
  children: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  testID?: string;
  /** 行内主轴 · 待办列 `column` · 双行+尾标 `row`。 */
  axis?: 'row' | 'column';
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
  /** 单页 DL 例外 · 不传则用 `getDataListRowLayout` */
  layout?: DataListRowLayout;
};

/**
 * Data list 行壳 · 边距 / 圆角 / `event-tap` / press-scale（xs）与首页待办一致。
 * @see docs/design.md § Data list
 */
export function DataListRow({
  children,
  accessibilityLabel,
  onPress,
  testID,
  axis = 'row',
  gap,
  contentStyle,
  layout: layoutOverride,
}: DataListRowProps) {
  const { colors, spacing } = useEdsTheme();
  const layout = layoutOverride ?? getDataListRowLayout(spacing);
  const { animatedStyle, onPressIn, onPressOut, pressing } =
    useEdsTapPressMotion(DL_PRESS_INTENSITY);

  const rowBackground = String(
    colors[pressing ? 'event-tap' : 'material-hide'],
  );

  return (
    <Animated.View
      style={{
        marginHorizontal: layout.marginH,
        alignSelf: 'stretch',
        overflow: 'visible',
        zIndex: pressing ? 1 : 0,
        paddingVertical: layout.slack,
      }}
    >
      <AnimatedPressable
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            flexDirection: axis,
            alignItems: axis === 'row' ? 'center' : 'stretch',
            alignSelf: 'stretch',
            gap,
            paddingVertical: layout.padV,
            paddingHorizontal: layout.padH,
            borderRadius: layout.radius,
            backgroundColor: rowBackground,
            overflow: 'visible',
          },
          contentStyle,
          animatedStyle,
        ]}
      >
        {children}
      </AnimatedPressable>
    </Animated.View>
  );
}
