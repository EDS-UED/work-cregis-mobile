import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { EgDivider } from '@/eds/home-ui';
import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@/eds/nav-bar';
import { shouldUseEgTabBarNativeStack } from '@/eds/runtime';
import { EgSymbolAction } from '@/eds/scene-buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { WalletTopBar } from '@/scenes/assets/WalletTopBar';
import { homeScrollTopReserve } from '@/scenes/home/HomeTopBar';
import { WalletAssetRow } from '@/scenes/assets/WalletAssetRow';
import { EdsGlassScreenShell } from '@/scenes/shared/EdsGlassScreenShell';
import { SceneText } from '@/scenes/shared/SceneText';
import { BalanceHeroBlock } from '@/scenes/shared/BalanceHeroBlock';
import { EgDataList } from '@/eds/data-list';
import {
  walletCurrencyTitleToListGap,
  walletListEditorScreenInset,
} from '@/scenes/assets/walletCurrencySectionLayout';
import {
  teamCenterDataListRowGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { useEdsMainScrollLayout } from '@/hooks/useEdsMainScrollLayout';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useAssetsStore } from '@/store';
import {
  edsNavContentGap,
  edsPageBackground,
  edsPx,
  edsSceneContentInset,
} from '@/utils/edsTheme';
import {
  nativeNavScrollSurfaceStyle,
  overlayNavScrollSurfaceStyle,
} from '@/utils/nativeNavScrollSurface';

type WalletSceneProps = {
  onOpenWalletSwitcher: () => void;
};

export function WalletScene({ onOpenWalletSwitcher }: WalletSceneProps) {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll({
    nativeScrollEdge: true,
  });
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const nativeTabBar = shouldUseEgTabBarNativeStack();
  const tabBarReserve = nativeTabBar
    ? 0
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const navContentGap = edsNavContentGap(spacing);
  const sceneContentInset = edsSceneContentInset(spacing);
  const balanceLabelToAmountGap = edsPx(spacing['spacing-2']);
  const balanceToDividerMarginTop = edsPx(spacing['spacing-8']);
  const dividerToCurrenciesMarginBottom = edsPx(spacing['spacing-5']);
  const listRowGap = teamCenterDataListRowGap(spacing);
  const listEditorScreenInset = walletListEditorScreenInset(spacing);
  const currencyTitleToListGap = walletCurrencyTitleToListGap(spacing);

  const totalBalance = useAssetsStore((s) => s.totalBalance);
  const balanceVisible = useAssetsStore((s) => s.balanceVisible);
  const assets = useAssetsStore((s) => s.assets);
  const toggleBalanceVisible = useAssetsStore((s) => s.toggleBalanceVisible);

  const [balanceOdometerIntroKey, setBalanceOdometerIntroKey] = useState(0);
  const skipOdometerIntroOnNextFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (skipOdometerIntroOnNextFocus.current) {
        skipOdometerIntroOnNextFocus.current = false;
        return;
      }
      setBalanceOdometerIntroKey((key) => key + 1);
    }, []),
  );

  const balanceText = balanceVisible ? totalBalance : '**********';
  const topReserve = homeScrollTopReserve(insets.top, navContentGap);
  const scrollPaddingTop = nativeNavBar ? navContentGap : topReserve;
  const scrollPaddingBottom = tabBarReserve;
  const scrollLayout = useEdsMainScrollLayout({
    layoutActive: nativeNavBar,
    paddingTop: scrollPaddingTop,
    paddingBottom: scrollPaddingBottom,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        content: {
          paddingHorizontal: sceneContentInset,
        },
        balanceToListDivider: {
          marginTop: balanceToDividerMarginTop,
          marginBottom: dividerToCurrenciesMarginBottom,
          marginHorizontal: -sceneContentInset,
          alignSelf: 'stretch',
        },
        currencySection: {
          gap: currencyTitleToListGap,
          alignSelf: 'stretch',
        },
        currencyHeaderBleed: {
          marginHorizontal: -sceneContentInset,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: sceneContentInset,
          paddingRight: listEditorScreenInset,
        },
        currencyTitle: {
          flex: 1,
          minWidth: 0,
        },
      }),
    [
      balanceToDividerMarginTop,
      colors,
      currencyTitleToListGap,
      dividerToCurrenciesMarginBottom,
      listEditorScreenInset,
      sceneContentInset,
    ],
  );

  const scrollBody = (
    <>
      <BalanceHeroBlock
        balanceVisible={balanceVisible}
        balanceText={balanceText}
        balanceOdometerIntroKey={balanceOdometerIntroKey}
        balanceLabel={t('scenes.walletAssets')}
        mode={mode}
        colors={colors}
        spacing={spacing}
        labelToAmountGap={balanceLabelToAmountGap}
        onToggle={toggleBalanceVisible}
        hideBalanceLabel={t('home.hideBalance')}
        showBalanceLabel={t('home.showBalance')}
        assetChartLabel={t('home.assetDistribution')}
        showAssetChart={false}
        amountTestID="wallet-balance-amount"
      />

      <View style={styles.balanceToListDivider}>
        <EgDivider variant="page" mode={mode} />
      </View>

      <View style={styles.currencySection}>
        <View style={styles.currencyHeaderBleed}>
          <SceneText variant="title" style={styles.currencyTitle}>
            {t('scenes.walletCurrenciesSection')}
          </SceneText>
          <EgSymbolAction
            size="md"
            tone="plain"
            icon="eds-list-editor"
            mode={mode}
            accessibilityLabel={t('scenes.walletListEditor')}
            testID="wallet-currency-list-editor"
          />
        </View>
        <EgDataList sceneContentInset={sceneContentInset} rowGap={listRowGap}>
          {assets.map((asset, index) => (
            <WalletAssetRow
              key={`${asset.symbol}-${index}`}
              item={asset}
              balanceVisible={balanceVisible}
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
        onLayout={scrollLayout.onViewportLayout}
        scrollEnabled={scrollLayout.scrollEnabled}
        showsVerticalScrollIndicator={scrollLayout.showsVerticalScrollIndicator}
        bounces={scrollLayout.bounces}
        alwaysBounceVertical={scrollLayout.alwaysBounceVertical}
        overScrollMode={scrollLayout.overScrollMode}
        contentContainerStyle={[
          styles.content,
          scrollLayout.contentContainerExtras.flexGrow != null
            ? { flexGrow: scrollLayout.contentContainerExtras.flexGrow }
            : null,
          scrollLayout.contentContainerExtras.paddingBottom != null
            ? { paddingBottom: scrollLayout.contentContainerExtras.paddingBottom }
            : { paddingBottom: scrollPaddingBottom },
          { paddingTop: scrollPaddingTop },
        ]}
      >
        <View onLayout={scrollLayout.onContentLayout} collapsable={false}>
          {scrollBody}
        </View>
      </ScrollView>
    );
  }

  return (
    <EdsGlassScreenShell
      style={styles.root}
      overlay={
        <WalletTopBar
          scrollOffset={scrollOffset}
          onOpenWalletSwitcher={onOpenWalletSwitcher}
        />
      }
    >
      <ScrollView
        style={overlayNavScrollSurfaceStyle()}
        nestedScrollEnabled
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { flexGrow: 1 },
          {
            paddingTop: scrollPaddingTop,
            paddingBottom: scrollPaddingBottom,
          },
        ]}
      >
        {scrollBody}
      </ScrollView>
    </EdsGlassScreenShell>
  );
}