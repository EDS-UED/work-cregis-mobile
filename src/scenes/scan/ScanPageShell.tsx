import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type ScanPageShellProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

/** 扫码页壳 · 透明根；相机与遮罩由 `ScanPageContent` 绘制。 */
export function ScanPageShell({ children, style, contentStyle }: ScanPageShellProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    overflow: 'visible',
  },
});
