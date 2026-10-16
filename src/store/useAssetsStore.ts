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

const MOCK_SYMBOLS = [
  'BTC',
  'ETH',
  'USDT',
  'USDC',
  'BCH',
  'LTC',
  'AVAX',
  'SOL',
  'DOT',
  'MATIC',
  'XRP',
  'ADA',
] as const;

/** 足够滚动以验收 iOS 26+ 系统 NavBar scroll edge 背景（Mock）。 */
const mockAssets: AssetItem[] = Array.from({ length: 24 }, (_, index) => {
  const symbol = MOCK_SYMBOLS[index % MOCK_SYMBOLS.length];
  const whole = ((index + 3) * 17) % 900;
  const frac = ((index + 7) * 13) % 10000;
  return {
    symbol: index >= MOCK_SYMBOLS.length ? `${symbol}-${index + 1}` : symbol,
    balance: `${whole}.${String(frac).padStart(4, '0')}`,
  };
});

export const useAssetsStore = create<AssetsState>((set) => ({
  totalBalance: '$730,650.83',
  assets: mockAssets,
  refreshMockAssets: () => set({ totalBalance: '$730,650.83', assets: mockAssets }),
}));
