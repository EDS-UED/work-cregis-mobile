import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useHideTabBarForInnerPage } from '@/hooks/useHideTabBarForInnerPage';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { ScanPageContent } from '@/scenes/home/ScanPageContent';
import { ScanPageShell } from '@/scenes/scan/ScanPageShell';

/**
 * 扫码全屏（iOS 26+ 系统栏触发器不在 page-shot 上下文时的等价入口 · EDS page 推入）。
 */
export function ScanScene() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useEdsTheme();

  useHideTabBarForInnerPage(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: t('home.scan'),
    });
  }, [navigation, t]);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: String(colors['material-same-black']) },
      ]}
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
  },
  flex: {
    flex: 1,
  },
});
