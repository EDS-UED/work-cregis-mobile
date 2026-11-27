import type { TeamAddressBookNetworkKey } from '@/scenes/team/detail/teamAddressBookDetailMock';

/** 主文本网络 Tag · 单链 / 多链 / 主网币不展示。 */
export type WalletAssetNetworkTag =
  | { kind: 'none' }
  | { kind: 'single'; networkLabelKey: TeamAddressBookNetworkKey }
  | { kind: 'multichain' };

/** 序号 1–10（work §4.3 同序）· 主网币不展示网络 Tag。 */
const WALLET_MAINNET_NO_TAG_1BASED = new Set([2, 3, 6, 7, 8, 9, 10]);

export function walletAssetNetworkTagAt(
  index: number,
  symbol: string,
): WalletAssetNetworkTag {
  const seq = index + 1;
  if (WALLET_MAINNET_NO_TAG_1BASED.has(seq)) {
    return { kind: 'none' };
  }
  if (symbol === 'USDT') {
    return { kind: 'multichain' };
  }
  return { kind: 'single', networkLabelKey: 'team.addressChainEthereum' };
}