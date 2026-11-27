import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 切换 Sheet · 总资产区 ↔ 钱包列表 · `spacing-6`（24px）。 */
export function walletSwitcherSheetBalanceListGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-6']);
}

/** 钱包切换卡 · 间距 · `spacing-4`（16px）。 */
export function walletSwitcherCardGap(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-4']);
}

/** 钱包切换卡 · 内边距左右 · `spacing-5`（20px）。 */
export function walletSwitcherCardPaddingHorizontal(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-5']);
}

/** 钱包切换卡 · 内边距上下 · `spacing-4`（16px）。 */
export function walletSwitcherCardPaddingVertical(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-4']);
}

/** 切换卡 · `eds-wallet` ↔ 钱包名称 · `spacing-1-5`（6px）。 */
export function walletSwitcherCardTitleIconNameGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1-5']);
}

/** 切换卡 · 钱包名称 ↔ Tag · `spacing-1`（4px）。 */
export function walletSwitcherCardTitleTagGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 切换卡 · 签名 `eds-wallet` 图形 · `symbol-xs`（16px）。 */
export function walletSwitcherCardSigIconDisplayPx(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['symbol-xs']);
}

/** 切换卡 · `eds-wallet` 矢量描边 · `stroke-lg`。 */
export const WALLET_SWITCHER_CARD_SIG_ICON_STROKE_SCALE = 'stroke-lg' as const;

/** 切换卡 · 主文本行 ↔ 副文本行 · `spacing-1-5`（6px）。 */
export function walletSwitcherCardTitleSubGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1-5']);
}

/** 切换卡 · 分片副文案 ↔ 状态图标 · `spacing-1`（4px）。 */
export function walletSwitcherCardSubIconGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 切换卡 · 分片行 ↔ 余额主行 · `spacing-2-5`（10px）。 */
export function walletSwitcherCardBalanceGapTop(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2-5']);
}