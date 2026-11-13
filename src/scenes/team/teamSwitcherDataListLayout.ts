import {
  getDataListRowLayout,
  type DataListRowLayout,
} from '@/scenes/shared/dataListLayout';
import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 团队切换 DL · 头像 / 加号 ↔ 文案 `spacing-3`（12px）。 */
export function teamSwitcherDataListMediaGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 团队切换 · 行内左右与全站 DL 一致 · `spacing-3`（12px）。 */
export function getTeamSwitcherDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  return getDataListRowLayout(spacing);
}
