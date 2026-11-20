import mobileTheme from '@/eds/tokens';
import type { TeamPlanTier } from '@/store';

type ThemeMode = 'light' | 'dark';
type TagColorType = 'blue' | 'purple' | 'green' | 'yellow';

const TAG_COLORS = mobileTheme.tags.mobileColor as Record<
  TagColorType,
  Record<ThemeMode, { bg: string; text: string }>
>;

export const TEAM_PLAN_TIER_LABEL_KEY = {
  basic: 'team.planBasic',
  advanced: 'team.planAdvanced',
  business: 'team.planBusiness',
  enterprise: 'team.planEnterprise',
} as const satisfies Record<TeamPlanTier, string>;

/** 套餐背景取色 · DS 标签调色板（`tags.mobileColor`），随明暗模式切换。 */
export function teamPlanTagColor(type: TagColorType, mode: ThemeMode) {
  return TAG_COLORS[type][mode];
}

/** 版本强调色（切换列表版本名）· 基础版沿用默认次级文字色。 */
export function teamPlanTierAccent(tier: TeamPlanTier, mode: ThemeMode): string | undefined {
  switch (tier) {
    case 'advanced':
      return teamPlanTagColor('green', mode).text;
    case 'business':
      return teamPlanTagColor('purple', mode).text;
    case 'enterprise':
      return teamPlanTagColor('yellow', mode).text;
    default:
      return undefined;
  }
}

/** 版本名 / 钻石标 · 各档强调色（基础版 `text-base-secondary`）。 */
export function teamPlanTierLabelColor(
  tier: TeamPlanTier,
  mode: ThemeMode,
  secondaryText: string,
): string {
  return teamPlanTierAccent(tier, mode) ?? secondaryText;
}

/** 账户卡版本钻石资源名 · 着色见 `TeamPlanTierDiamondIcon`（与 `teamPlanTierLabelColor` 同色）。 */
export const TEAM_PLAN_TIER_DIAMOND_SYMBOL = 'eds-diamond-fill' as const;
