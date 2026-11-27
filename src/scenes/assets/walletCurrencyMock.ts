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

/** @see `.cursor/rules/work.md` §4.3 — 与首页待办币种同序。 */
export function buildWalletMockAssets(): WalletAssetItem[] {
  return HOME_TODO_MOCK_CURRENCIES_FIRST_10.map((symbol, index) => ({
    symbol,
    name: WALLET_CURRENCY_FULL_NAMES[symbol] ?? symbol,
    balance: MOCK_BALANCES[symbol] ?? '0.00',
    networkTag: walletAssetNetworkTagAt(index, symbol),
  }));
}