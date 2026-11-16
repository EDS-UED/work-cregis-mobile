import { StyleSheet, View } from 'react-native';

import { useHideTabBarForInnerPage } from '@/hooks/useHideTabBarForInnerPage';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { ScanPageContent } from '@/scenes/home/ScanPageContent';
import { ScanPageShell } from '@/scenes/scan/ScanPageShell';

/** 扫码全屏 · Stack `Scan`（iOS 26+ / RN 栈统一 `ScanPageContent`）。 */
export function ScanScene() {
  const { colors } = useEdsTheme();

  useHideTabBarForInnerPage(true);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: String(colors['material-same-black']) },
      ]}
      collapsable={false}
    >
      <ScanPageShell style={styles.flex}>
        <ScanPageContent />
      </ScanPageShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'visible',
  },
  flex: {
    flex: 1,
  },
});
