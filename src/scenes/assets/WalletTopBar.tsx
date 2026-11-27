import { useMemo } from 'react';
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
import { WalletNavTitle } from '@/scenes/assets/WalletNavTitle';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type WalletTopBarProps = {
  scrollOffset: EgNavBarScrollOffset;
  onOpenWalletSwitcher: () => void;
};

export function WalletTopBar({ scrollOffset, onOpenWalletSwitcher }: WalletTopBarProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const shellHeight = egNavBarScrollContentReserve(insets.top);
  const rowGap = edsPx(spacing['spacing-2']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          gap: rowGap,
        },
        titleSlot: {
          flex: 1,
          minWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sideSlot: {
          flexShrink: 0,
          overflow: 'visible',
        },
      }),
    [insets.top, rowGap, shellHeight],
  );

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
        <View style={styles.sideSlot}>
          <WalletNavLeading />
        </View>
        <View style={styles.titleSlot} pointerEvents="box-none">
          <WalletNavTitle onOpenSwitcher={onOpenWalletSwitcher} />
        </View>
        <View style={styles.sideSlot}>
          <WalletNavTrailing />
        </View>
      </View>
    </View>
  );
}