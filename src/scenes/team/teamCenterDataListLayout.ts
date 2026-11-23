import type { ViewStyle } from 'react-native';

import {
  dataListRowGap,
  dataListRowShellInset,
  getDataListRowLayout,
  type DataListRowLayout,
} from '@/scenes/shared/dataListLayout';
import { edsPx } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** 行壳距屏 · 与全站 `dataListRowShellInset` 一致 · `spacing-2`（8px）。 */
export function teamCenterListEdgeFromScreen(
  spacing: typeof mobileTheme.spacing,
): number {
  return dataListRowShellInset(spacing);
}

/** 团队中心 DL · 行首圆标 ↔ 文案 `spacing-3`（12px）。 */
export function teamCenterDataListMediaGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 同组菜单行纵向间距 · 与 `dataListRowGap` 一致 · `spacing-1`（4px）。 */
export function teamCenterDataListGroupStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  return { gap: dataListRowGap(spacing) };
}

/** TeamCenter · 行布局与全站 DL 一致（屏缘 8px · 媒体间距见上）。 */
export function getTeamCenterDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  const base = getDataListRowLayout(spacing);
  return {
    ...base,
    titleSubGap: edsPx(spacing['spacing-05']),
  };
}

/** 行间分割线 · 左边与 `TeamCenterMenuRow` 主标题左缘对齐。 */
export function teamCenterMenuRowDividerInsets(
  spacing: typeof mobileTheme.spacing,
  inCardShell: boolean,
): { paddingLeft: number; paddingRight: number } {
  const layout = getTeamCenterDataListRowLayout(spacing);
  const marginH = inCardShell ? 0 : layout.marginH;
  const leadIconSlot = edsPx(spacing['capsule-md']);
  const mediaGap = teamCenterDataListMediaGap(spacing);

  return {
    paddingLeft: marginH + layout.padH + leadIconSlot + mediaGap,
    paddingRight: marginH + layout.padH,
  };
}
