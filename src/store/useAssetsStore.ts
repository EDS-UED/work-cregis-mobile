import { create } from 'zustand';

import { sumWalletBalancesDisplay } from '@/scenes/assets/walletBalanceDisplay';
import { buildWalletMockAssets } from '@/scenes/assets/walletCurrencyMock';
import type { WalletAssetNetworkTag } from '@/scenes/assets/walletAssetNetwork';

export type WalletSigKind = 'multisig' | 'singlesig';

export type WalletSwitcherItem = {
  id: string;
  name: string;
  sigKind: WalletSigKind;
  shardSynced: boolean;
  balanceDisplay: string;
  previewCurrencies: string[];
  overflowCount?: number;
};

export type WalletAssetItem = {
  symbol: string;
  name: string;
  balance: string;
  networkTag: WalletAssetNetworkTag;
};

type AssetsState = {
  wallets: WalletSwitcherItem[];
  activeWalletId: string;
  walletName: string;
  totalBalance: string;
  balanceVisible: boolean;
  assets: WalletAssetItem[];
  setActiveWallet: (walletId: string) => void;
  toggleBalanceVisible: () => void;
  refreshMockAssets: () => void;
};

const WALLET_SWITCHER_SEED: WalletSwitcherItem[] = [
  {
    id: 'w_primary',
    name: 'Pixel Studio Pr.',
    sigKind: 'multisig',
    shardSynced: true,
    balanceDisplay: '$ 88,071.60',
    previewCurrencies: ['ETH', 'USDT', 'BTC', 'AAVE'],
  },
  {
    id: 'w_sui',
    name: 'Northwind Treasury',
    sigKind: 'multisig',
    shardSynced: true,
    balanceDisplay: '$ 0.73',
    previewCurrencies: ['HYPE', 'TON', 'ZEC', 'USDT', 'AAVE', 'MNT'],
    overflowCount: 99,
  },
  {
    id: 'w_test',
    name: 'Test',
    sigKind: 'singlesig',
    shardSynced: false,
    balanceDisplay: '$ 3,220.77',
    previewCurrencies: ['DEEP', 'AVAX', 'GBG'],
  },
];

const DEFAULT_WALLET_ID = WALLET_SWITCHER_SEED[0]!.id;

function walletNameFor(id: string): string {
  return WALLET_SWITCHER_SEED.find((w) => w.id === id)?.name ?? WALLET_SWITCHER_SEED[0]!.name;
}

const assetsSnapshot = () => {
  const wallets = WALLET_SWITCHER_SEED;
  return {
    wallets,
    activeWalletId: DEFAULT_WALLET_ID,
    walletName: walletNameFor(DEFAULT_WALLET_ID),
    totalBalance: sumWalletBalancesDisplay(wallets),
    balanceVisible: true,
    assets: buildWalletMockAssets(),
  };
};

export const useAssetsStore = create<AssetsState>((set, get) => ({
  ...assetsSnapshot(),
  setActiveWallet: (walletId) => {
    const wallet = get().wallets.find((w) => w.id === walletId);
    if (!wallet) return;
    set({ activeWalletId: walletId, walletName: wallet.name });
  },
  toggleBalanceVisible: () =>
    set((state) => ({ balanceVisible: !state.balanceVisible })),
  refreshMockAssets: () => set(assetsSnapshot()),
}));