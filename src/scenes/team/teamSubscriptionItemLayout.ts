import type { ViewStyle } from 'react-native';

import { EG_ITEM_PAD_V_LG } from '@/eds/item';
import { EG_PAGE_CONTENT_PADDING_HORIZONTAL } from '@/eds/page-shot';
import type mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

/** 订阅 Hero · 企业行 ↔ 套餐主标题 · 原 `spacing-5` + 4px → `spacing-6`（24px）。 */
export function teamSubscriptionHeroEnterpriseToTierGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-6']);
}

/** 订阅 Hero · 套餐主标题 ↔ 到期副文案 · `spacing-05`（2px）。 */
export function teamSubscriptionHeroTierTitleBodyGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-05']);
}

/** 订阅 Hero · 到期副文案 ↔ 续费/升级按钮 · `spacing-7`（28px）。 */
export function teamSubscriptionHeroSubtitleToActionsGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-7']);
}

/** 订阅 Hero 内容区底内边距（续费/升级与色带下沿）· `spacing-9`（36px）。 */
export function teamSubscriptionHeroForegroundPaddingBottom(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-9']);
}

/** 订阅 Hero 色带下沿 → 首条「权益」`EgItem` · `spacing-4`（16px）。 */
export function teamSubscriptionHeroToBenefitsGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-4']);
}

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

/** 大块 module 分割线 · 上边距 · `spacing-3`（12px）。 */
export function teamSubscriptionSectionDividerInsetTop(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 大块 module 分割线 · 下边距 · `spacing-3`（12px）。 */
export function teamSubscriptionSectionDividerInsetBottom(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
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

/** 权益 Item 行内上下 · `spacing-4`（16px）· 对齐 `padSize="lg"`。 */
export function teamSubscriptionBenefitItemPaddingV(
  _spacing: typeof mobileTheme.spacing,
): number {
  return EG_ITEM_PAD_V_LG as number;
}

/** 客户经理条 · 距上方 module / 根分分割线下沿 · `spacing-6`（24px）。 */
export function teamSubscriptionSupportBannerMarginTop(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-6']);
}

/** 客户经理条 · 距屏左右 · `spacing-5`（20px）。 */
export function teamSubscriptionSupportBannerMarginH(
  spacing: typeof mobileTheme.spacing,
): number {
  const shellInset = edsPx(spacing['spacing-5']);
  const parentPad = EG_PAGE_CONTENT_PADDING_HORIZONTAL as number;
  return shellInset - parentPad;
}

/** 客户经理条 · 卡内左右内边距 · `spacing-5`（20px）。 */
export function teamSubscriptionSupportBannerPaddingH(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-5']);
}

/** 客户经理条 · 圆角 · `radius-md`（16px）。 */
export function teamSubscriptionSupportBannerRadius(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['radius-md']);
}

/** 客户经理条 · 主文案前图标 · `symbol-xs`（16px）。 */
export function teamSubscriptionSupportBannerTitleIconSize(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['symbol-xs']);
}

/** 客户经理条 · 图标与主文案间距 · `spacing-1`（4px）。 */
export function teamSubscriptionSupportBannerTitleIconGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 客户经理条 · 主文案与副文案间距 · `spacing-1`（4px）。 */
export function teamSubscriptionSupportBannerTitleBodyGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/** 订阅正文壳已 `EG_PAGE_CONTENT_PADDING_HORIZONTAL` · 分组外缘 4px · 无卡面填充/圆角 · 子项 `gap: 0`。 */
export function teamSubscriptionEgItemGroupScreenStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  const shellInset = teamSubscriptionEgItemShellInset(spacing);
  const parentPad = EG_PAGE_CONTENT_PADDING_HORIZONTAL as number;
  return {
    marginHorizontal: shellInset - parentPad,
    padding: edsPx(spacing['spacing-0']),
    gap: edsPx(spacing['spacing-0']),
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
  };
}