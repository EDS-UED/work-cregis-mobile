import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GlassBlurBackdrop } from '@eds-evergreen/mobile';

type EdsGlassScreenShellProps = {
  children: ReactNode;
  /** 玻璃控件（NavBar / Tab 浮层）须与 Scroll 内容同级，不能放进 Backdrop。 */
  overlay?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Android expo-blur 采样源 — 与 EDS Showcase `GlassBlurBackdrop` 一致。 */
export function EdsGlassScreenShell({ children, overlay, style }: EdsGlassScreenShellProps) {
  const isFocused = useIsFocused();

  return (
    <View collapsable={false} style={[styles.root, style]}>
      <GlassBlurBackdrop style={styles.backdrop} active={isFocused}>
        {children}
      </GlassBlurBackdrop>
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
  },
});
