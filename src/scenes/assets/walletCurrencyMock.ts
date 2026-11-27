import { HOME_TODO_MOCK_CURRENCIES_FIRST_10 } from '@/store/useHomeStore';
import type { WalletAssetItem } from '@/store/useAssetsStore';
import { walletAssetNetworkTagAt } from '@/scenes/assets/walletAssetNetwork';

/** Mock 全名 · 与 EDS crypto 资产一致。 */
export const WALLET_CURRENCY_FULL_NAMES: Record<string, string> = {
  HYPE: 'Hyperliquid',
  TON: 'TON',
  ZEC: 'Zcash',
  USDT: 'Tether USD',
  AAVE: 'Aave',
  MNT: 'Mantle',
  GBG: 'Bitget Token',
  '1INCH': '1inch Network',
  DEEP: 'DeepBook Protocol',
  AVAX: 'Avalanche',
};

const MOCK_BALANCES: Record<string, string> = {
  HYPE: '12,420.10',
  TON: '8,204.88',
  ZEC: '45.009',
  USDT: '92,104.00',
  AAVE: '4.201',
  MNT: '1,204.50',
  GBG: '88,600.12',
  '1INCH': '3,210.00',
  DEEP: '18,330.20',
  AVAX: '220.15',
};

function assetRow(
  symbol: string,
  homeOrderIndex: number,
  balance: string,
): WalletAssetItem {
  return {
    symbol,
    name: WALLET_CURRENCY_FULL_NAMES[symbol] ?? symbol,
    balance,
    networkTag: walletAssetNetworkTagAt(homeOrderIndex, symbol),
  };
}

function homeIndexForSymbol(symbol: string): number {
  const index = (HOME_TODO_MOCK_CURRENCIES_FIRST_10 as readonly string[]).indexOf(
    symbol,
  );
  return index >= 0 ? index : 0;
}

/** @see `.cursor/rules/work.md` §4.3 — 主钱包 · 与首页待办币种同序。 */
export function buildWalletMockAssets(): WalletAssetItem[] {
  return HOME_TODO_MOCK_CURRENCIES_FIRST_10.map((symbol, index) =>
    assetRow(symbol, index, MOCK_BALANCES[symbol] ?? '0.00'),
  );
}

/** 各钱包 Mock 币种 · 与 `WalletSwitcherItem.previewCurrencies` 对应。 */
export function buildWalletMockAssetsForWallet(walletId: string): WalletAssetItem[] {
  if (walletId === 'w_primary') {
    return buildWalletMockAssets();
  }
  if (walletId === 'w_sui') {
    return ['HYPE', 'TON', 'ZEC', 'USDT', 'AAVE', 'MNT'].map((symbol) =>
      assetRow(symbol, homeIndexForSymbol(symbol), '0.01'),
    );
  }
  if (walletId === 'w_test') {
    return ['DEEP', 'AVAX', 'GBG'].map((symbol) =>
      assetRow(
        symbol,
        homeIndexForSymbol(symbol),
        symbol === 'DEEP' ? '1,100.00' : symbol === 'AVAX' ? '1,120.77' : '1,000.00',
      ),
    );
  }
  return buildWalletMockAssets();
}