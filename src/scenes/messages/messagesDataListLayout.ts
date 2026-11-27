import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 通知 Hub / 分类内页 · 数据表行间 · `spacing-1`（4px）。 */
export function messagesDataListRowGap(spacing: typeof mobileTheme.spacing): number {
  return edsPx(spacing['spacing-1']);
}