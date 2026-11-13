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

/**
 * 团队切换 · EgSheets 内 DL 例外（`docs/design.md` §3.4）
 * 行内左右 `spacing-4`（16px）· 媒体间距见 `teamSwitcherDataListMediaGap`。
 */
export function getTeamSwitcherDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  const base = getDataListRowLayout(spacing);
  const padH = edsPx(spacing['spacing-4']);
  return {
    ...base,
    padH,
    contentInsetFromScreen: base.marginH + padH,
  };
}
