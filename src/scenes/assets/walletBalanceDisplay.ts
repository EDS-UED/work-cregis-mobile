import type { WalletSwitcherItem } from '@/store/useAssetsStore';

/** 解析切换卡金额文案（如 `$ 88,071.60`）为数值。 */
export function parseWalletBalanceDisplay(display: string): number {
  const normalized = display.replace(/^\$\s*/, '').replace(/,/g, '').trim();
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

/** Mock / 折合展示 · `$ ` + 千分位 · 两位小数。 */
export function formatWalletBalanceDisplay(amount: number): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$ ${formatted}`;
}

/** 切换钱包列表金额相加 → 总资产展示。 */
export function sumWalletBalancesDisplay(wallets: readonly WalletSwitcherItem[]): string {
  const sum = wallets.reduce(
    (acc, wallet) => acc + parseWalletBalanceDisplay(wallet.balanceDisplay),
    0,
  );
  return formatWalletBalanceDisplay(sum);
}