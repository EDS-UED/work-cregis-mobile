import { dataListRowGap, getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { teamCenterMenuRowDividerInsets } from '@/scenes/team/teamCenterDataListLayout';
import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 通知前置 · 行间 `spacing-1`（4px）· 与全站 `dataListRowGap` 一致。 */
export function messagesHubRowGap(spacing: typeof mobileTheme.spacing): number {
  void spacing;
  return dataListRowGap(spacing);
}

/** 通知前置 · 行首 `capsule-md`（与团队中心 DL 一致）。 */
export function messagesHubRowDividerInsets(spacing: typeof mobileTheme.spacing) {
  return teamCenterMenuRowDividerInsets(spacing, false);
}

/** 通知内页 · 行首 `avatar-xl`。 */
export function messagesListRowDividerInsets(spacing: typeof mobileTheme.spacing) {
  const layout = getDataListRowLayout(spacing);
  const leadSlot = edsPx(spacing['avatar-xl']);
  const mediaGap = edsPx(spacing['spacing-3']);

  return {
    paddingLeft: layout.marginH + layout.padH + leadSlot + mediaGap,
    paddingRight: layout.marginH + layout.padH,
  };
}