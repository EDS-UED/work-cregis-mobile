import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { EgButtonGlass } from '@/eds/button-glass';
import { EgSymbol } from '@/eds/home-ui';
import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@/eds/nav-bar';
import { shouldUseEgTabBarNativeStack } from '@/eds/runtime';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { WalletTopBar } from '@/scenes/assets/WalletTopBar';
import { homeScrollTopReserve } from '@/scenes/home/HomeTopBar';
import { WalletAssetRow } from '@/scenes/assets/WalletAssetRow';
import { EdsGlassScreenShell } from '@/scenes/shared/EdsGlassScreenShell';
import { SceneText } from '@/scenes/shared/SceneText';
import { EgDataList } from '@/eds/data-list';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useAssetsStore } from '@/store';
import {
  edsNavContentGap,
  edsPageBackground,
  edsPx,
  edsSceneContentInset,
} from '@/utils/edsTheme';
import { nativeNavScrollSurfaceStyle } from '@/utils/nativeNavScrollSurface';
import { overlayNavScrollSurfaceStyle } from '@/utils/nativeNavScrollSurface';

function BalanceVisibilityIcon({
  balanceVisible,
  mode,
}: {
  balanceVisible: boolean;
  mode: 'light' | 'dark';
}) {
  const { spacing } = useEdsTheme();
  const iconPx = edsPx(spacing['symbol-xs']);

  return (
    <EgSymbol
      name={balanceVisible ? 'eds-eye' : 'eds-close-eye'}
      displayPx={iconPx}
      mode={mode}
      strokeColorToken="text-base-secondary"
    />
  );
}

export function WalletScene() {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const nativeTabBar = shouldUseEgTabBarNativeStack();
  const tabBarReserve = nativeTabBar
    ? 0
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const navContentGap = edsNavContentGap(spacing);
  const sceneContentInset = edsSceneContentInset(spacing);

  const walletName = useAssetsStore((s) => s.walletName);
  const totalBalance = useAssetsStore((s) => s.totalBalance);
  const balanceVisible = useAssetsStore((s) => s.balanceVisible);
  const assets = useAssetsStore((s) => s.assets);
  const toggleBalanceVisible = useAssetsStore((s) => s.toggleBalanceVisible);

  const balanceText = balanceVisible ? totalBalance : '**********';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        content: {
          paddingHorizontal: sceneContentInset,
          gap: edsPx(spacing['spacing-7']),
        },
        walletPickerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
        },
        cryptoHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      }),
    [colors, sceneContentInset, spacing],
  );

  const scrollBody = (
  <>
      <Pressable
        onPress={toggleBalanceVisible}
        accessibilityRole="button"
        accessibilityLabel={
          balanceVisible ? t('home.hideBalance') : t('home.showBalance')
        }
      >
        <View style={{ gap: edsPx(spacing['spacing-3']) }}>
          <View style={styles.walletPickerRow}>
            <SceneText variant="bodySemibold">{walletName}</SceneText>
            <EgSymbol
              name="eds-arrow-down-mini-ios"
              size="sm"
              mode={mode}
              strokeColorToken="text-base-secondary"
            />
            <BalanceVisibilityIcon balanceVisible={balanceVisible} mode={mode} />
          </View>
          <SceneText variant="display">{balanceText}</SceneText>
        </View>
      </Pressable>

      <View style={{ gap: edsPx(spacing['spacing-4']) }}>
        <View style={styles.cryptoHeader}>
          <SceneText variant="title">{t('scenes.walletCryptoSection')}</SceneText>
          <EgButtonGlass
            kind="icon"
            iconCount={1}
            size="md"
            mode={mode}
            icon="eds-filter"
            accessibilityLabel={t('scenes.walletFilter')}
            testID="wallet-crypto-filter"
          />
        </View>
        <EgDataList sceneContentInset={sceneContentInset}>
          {assets.map((asset) => (
            <WalletAssetRow
              key={asset.symbol}
              item={asset}
              balanceVisible={balanceVisible}
              multichainLabel={t('scenes.walletMultichain')}
            />
          ))}
        </EgDataList>
      </View>
    </>
  );

  if (nativeNavBar) {
    return (
      <ScrollView
        style={[nativeNavScrollSurfaceStyle(colors), styles.root]}
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: navContentGap, paddingBottom: tabBarReserve },
        ]}
      >
        {scrollBody}
      </ScrollView>
    );
  }

  return (
    <EdsGlassScreenShell style={styles.root} overlay={<WalletTopBar scrollOffset={scrollOffset} />}>
      <ScrollView
        style={overlayNavScrollSurfaceStyle()}
        nestedScrollEnabled
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: homeScrollTopReserve(insets.top, navContentGap),
            paddingBottom: tabBarReserve,
          },
        ]}
      >
        {scrollBody}
      </ScrollView>
    </EdsGlassScreenShell>
  );
}
