import { create } from 'zustand';

export type AssetItem = {
  symbol: string;
  name: string;
  balance: string;
  multichain?: boolean;
};

type AssetsState = {
  walletName: string;
  totalBalance: string;
  balanceVisible: boolean;
  assets: AssetItem[];
  toggleBalanceVisible: () => void;
  refreshMockAssets: () => void;
};

const WALLET_MOCK_ASSETS: AssetItem[] = [
  { symbol: 'APT', name: 'Aptos', balance: '12.4201' },
  { symbol: 'OCEAN', name: 'Ocean Protocol', balance: '1,204.88' },
  { symbol: 'EGLD', name: 'Elrond', balance: '45.009', multichain: true },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.8421' },
  { symbol: 'ETH', name: 'Ethereum', balance: '18.3302' },
  { symbol: 'USDT', name: 'Tether USD', balance: '92,104.00' },
  { symbol: 'AVAX', name: 'Avalanche', balance: '220.15' },
  { symbol: 'SOL', name: 'Solana', balance: '88.6' },
  { symbol: 'AAVE', name: 'Aave', balance: '4.201' },
  { symbol: 'DOT', name: 'Polkadot', balance: '310.0' },
  { symbol: 'MATIC', name: 'Polygon', balance: '5,400.12' },
  { symbol: 'ZEC', name: 'Zcash', balance: '12.88' },
];

const assetsSnapshot = () => ({
  walletName: 'Wallet Name',
  totalBalance: '$ 1,329,237.73',
  balanceVisible: true,
  assets: WALLET_MOCK_ASSETS,
});

export const useAssetsStore = create<AssetsState>((set) => ({
  ...assetsSnapshot(),
  toggleBalanceVisible: () =>
    set((state) => ({ balanceVisible: !state.balanceVisible })),
  refreshMockAssets: () => set(assetsSnapshot()),
}));
