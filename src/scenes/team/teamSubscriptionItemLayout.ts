import type { ViewStyle } from 'react-native';

import { EG_ITEM_PAD_V_MD } from '@/eds/item';
import { EG_PAGE_CONTENT_PADDING_HORIZONTAL } from '@/eds/page-shot';
import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 订阅稿 · `EgItemGroup` 分组卡距屏左右 · `spacing-1`（4px）。 */
export function teamSubscriptionEgItemShellInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 订阅稿 · 两组 `EgItemGroup` 之间额外纵距 · `spacing-0`（分割线承担留白）。 */
export function teamSubscriptionEgItemGroupsGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-0']);
}

/** 大块 module 分割线 · 上边距 · `spacing-4`（16px）。 */
export function teamSubscriptionSectionDividerInsetTop(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-4']);
}

/** 大块 module 分割线 · 下边距 · `spacing-7`（28px）。 */
export function teamSubscriptionSectionDividerInsetBottom(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-7']);
}

/** 权益用量 · 主行与进度条间距 · `spacing-2-5`（10px）。 */
export function teamSubscriptionBenefitProgressGapTop(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2-5']);
}

/** 权益 Item 行内左右 · `spacing-4`（16px）· 对齐 `EG_ITEM_PAD_H`。 */
export function teamSubscriptionBenefitItemPaddingH(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-4']);
}

/** 权益 Item 行内上下 · `spacing-3`（12px）· 对齐 `padSize="md"`。 */
export function teamSubscriptionBenefitItemPaddingV(
  _spacing: typeof mobileTheme.spacing,
): number {
  return EG_ITEM_PAD_V_MD as number;
}

/** 订阅正文壳已 `EG_PAGE_CONTENT_PADDING_HORIZONTAL` · 分组外缘 4px · 无卡面填充/圆角 · 子项 `gap: 4`。 */
export function teamSubscriptionEgItemGroupScreenStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  const shellInset = teamSubscriptionEgItemShellInset(spacing);
  const parentPad = EG_PAGE_CONTENT_PADDING_HORIZONTAL as number;
  return {
    marginHorizontal: shellInset - parentPad,
    padding: edsPx(spacing['spacing-0']),
    gap: edsPx(spacing['spacing-1']),
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
  };
}