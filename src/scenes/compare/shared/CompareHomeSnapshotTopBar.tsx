import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import {
  EgNavBar,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
  type EgNavBarScrollOffset,
} from '@/eds/nav-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { EgButtonGlass } from '@/eds/button-glass';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { HomeNavLeading, HomeNavTrailing } from '@/scenes/home/HomeNavBarParts';
import { edsPx } from '@/utils/edsTheme';

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

type CompareHomeSnapshotTopBarProps = {
  scrollOffset: EgNavBarScrollOffset;
  /** 交易记录 Hub 推入时展示玻璃返回钮（主页 Tab 无此项）。 */
  showBack?: boolean;
};

/**
 * 对比 · 主页快照 overlay 顶栏 — 同 `HomeTopBar` 玻璃钮 + 推入态返回。
 * **仅 Android / iOS ≤25**（iOS 26+ 走系统 Nav + scroll edge，与 HomeMain 同闸）。
 */
export function CompareHomeSnapshotTopBar({
  scrollOffset,
  showBack = false,
}: CompareHomeSnapshotTopBarProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const shellHeight = egNavBarScrollContentReserve(insets.top);

  const styles = StyleSheet.create({
    shell: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: shellHeight,
      zIndex: 10,
    },
    navBackground: {
      ...StyleSheet.absoluteFill,
      zIndex: 0,
    },
    contentRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: insets.top,
      bottom: 0,
      zIndex: 2,
      elevation: 2,
      paddingTop: EG_NAV_BAR_PADDING_TOP,
      paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
      paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: edsPx(spacing['spacing-3']),
    },
  });

  return (
    <View style={styles.shell} collapsable={false} pointerEvents="box-none">
      <EgNavBar
        chromeContext="overlay"
        mode={mode}
        title={t('tabs.home')}
        showLeft={false}
        showTitle={false}
        showRight={false}
        background="auto"
        scrollOffset={scrollOffset}
        style={styles.navBackground}
      />
      <View style={styles.contentRow} collapsable={false} pointerEvents="box-none">
        {showBack ? (
          <EgButtonGlass
            {...glassIconDefaults}
            mode={mode}
            icon="eds-arrow-left-ios"
            accessibilityLabel={t('common.back')}
            onPress={() => navigation.goBack()}
            testID="compare-home-nav-back"
          />
        ) : null}
        <HomeNavLeading />
        <HomeNavTrailing />
      </View>
    </View>
  );
}