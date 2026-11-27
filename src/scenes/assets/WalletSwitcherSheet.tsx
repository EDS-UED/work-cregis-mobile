import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDecorButton } from '@/eds/scene-buttons';
import { EgSheets, type EgSheetsActionsBlankCompensation } from '@/eds/sheets';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { WalletSwitcherCard } from '@/scenes/assets/WalletSwitcherCard';
import {
  walletSwitcherCardGap,
  walletSwitcherSheetBalanceListGap,
} from '@/scenes/assets/walletSwitcherLayout';
import { sumWalletBalancesDisplay } from '@/scenes/assets/walletBalanceDisplay';
import { BalanceHeroBlock } from '@/scenes/shared/BalanceHeroBlock';
import { useAssetsStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

type WalletSwitcherSheetProps = {
  visible: boolean;
  onDismiss: () => void;
};

/** 切换钱包 · 总资产 + 卡片列表 + 底栏创建。 */
export function WalletSwitcherSheet({ visible, onDismiss }: WalletSwitcherSheetProps) {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const wallets = useAssetsStore((s) => s.wallets);
  const activeWalletId = useAssetsStore((s) => s.activeWalletId);
  const balanceVisible = useAssetsStore((s) => s.balanceVisible);
  const toggleBalanceVisible = useAssetsStore((s) => s.toggleBalanceVisible);
  const setActiveWallet = useAssetsStore((s) => s.setActiveWallet);
  const cardGap = walletSwitcherCardGap(spacing);
  const balanceListGap = walletSwitcherSheetBalanceListGap(spacing);
  const labelToAmountGap = edsPx(spacing['spacing-1']);

  const totalBalance = useMemo(
    () => sumWalletBalancesDisplay(wallets),
    [wallets],
  );
  const balanceText = balanceVisible ? totalBalance : '**********';

  const sheetActionStyles = useMemo(
    () =>
      StyleSheet.create({
        block: {
          gap: edsPx(spacing['spacing-3']),
          alignSelf: 'stretch',
          width: '100%',
        },
        optionFill: {
          alignSelf: 'stretch',
          width: '100%',
        },
      }),
    [spacing],
  );

  const sheetActions = useMemo(
    () => (
      <View style={sheetActionStyles.block}>
        <EgDecorButton
          label={t('scenes.walletSwitcherCreate')}
          mode={mode}
          size="lg"
          figmaType="primary"
          onPress={() => undefined}
          style={sheetActionStyles.optionFill}
        />
      </View>
    ),
    [mode, sheetActionStyles, t],
  );

  const handleSelect = useCallback(
    (walletId: string) => {
      setActiveWallet(walletId);
      onDismiss();
    },
    [onDismiss, setActiveWallet],
  );

  const bodyStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: 'stretch',
          gap: balanceListGap,
        },
        list: {
          gap: cardGap,
          alignSelf: 'stretch',
        },
      }),
    [balanceListGap, cardGap],
  );

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      detents={['adaptive', 'large']}
      initialDetent="adaptive"
      title={t('scenes.walletSwitcherTitle')}
      showTitle
      showRight
      dismissible
      showActions
      actions={sheetActions}
      actionsBlankCompensation={'spacing-14' as EgSheetsActionsBlankCompensation}
    >
      <View style={bodyStyles.root}>
        <BalanceHeroBlock
          balanceVisible={balanceVisible}
          balanceText={balanceText}
          balanceLabel={t('scenes.walletAssets')}
          animateAmountIntro={false}
          labelVariant="bodySmallStrong"
          labelColorToken="text-base-primary"
          amountVariant="display"
          mode={mode}
          colors={colors}
          spacing={spacing}
          labelToAmountGap={labelToAmountGap}
          onToggle={toggleBalanceVisible}
          hideBalanceLabel={t('home.hideBalance')}
          showBalanceLabel={t('home.showBalance')}
          assetChartLabel={t('home.assetDistribution')}
          showAssetChart={false}
          amountTestID="wallet-switcher-total-balance"
        />
        <View style={bodyStyles.list}>
          {wallets.map((wallet) => (
            <WalletSwitcherCard
              key={wallet.id}
              wallet={wallet}
              selected={wallet.id === activeWalletId}
              balanceVisible={balanceVisible}
              onSelect={() => handleSelect(wallet.id)}
            />
          ))}
        </View>
      </View>
    </EgSheets>
  );
}