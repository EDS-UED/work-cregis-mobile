import { create } from 'zustand';

type AssetItem = {
  symbol: string;
  balance: string;
};

type AssetsState = {
  totalBalance: string;
  assets: AssetItem[];
  refreshMockAssets: () => void;
};

const mockAssets: AssetItem[] = [
  { symbol: 'BTC', balance: '0.42' },
  { symbol: 'ETH', balance: '2.81' },
  { symbol: 'USDT', balance: '12,483.42' },
];

export const useAssetsStore = create<AssetsState>((set) => ({
  totalBalance: '$12,483.42',
  assets: mockAssets,
  refreshMockAssets: () => set({ totalBalance: '$12,483.42', assets: mockAssets }),
}));
