import { StyleSheet, View } from 'react-native';
import {
  EgNavBar,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  type EgNavBarScrollOffset,
} from '@/eds/nav-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { WalletNavLeading, WalletNavTrailing } from '@/scenes/assets/WalletNavParts';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type WalletTopBarProps = {
  scrollOffset: EgNavBarScrollOffset;
};

export function WalletTopBar({ scrollOffset }: WalletTopBarProps) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
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
    },
  });

  if (nativeNavBar) {
    return null;
  }

  return (
    <View style={styles.shell} collapsable={false} pointerEvents="box-none">
      <EgNavBar
        chromeContext="overlay"
        mode={mode}
        title={t('tabs.wallet')}
        showLeft={false}
        showTitle={false}
        showRight={false}
        background="auto"
        scrollOffset={scrollOffset}
        style={styles.navBackground}
      />
      <View style={styles.contentRow} collapsable={false} pointerEvents="box-none">
        <WalletNavLeading />
        <WalletNavTrailing />
      </View>
    </View>
  );
}
