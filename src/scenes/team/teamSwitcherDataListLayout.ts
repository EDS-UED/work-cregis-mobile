import type { ViewStyle } from 'react-native';

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

/** 创建团队行 · 行壳内侧额外左内边距 +26px（`spacing-6` + `spacing-05`），与团队行拖拽柄列对齐。 */
export function teamSwitcherCreateRowExtraLeadingInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-6']) + edsPx(spacing['spacing-05']);
}

/** 创建团队 · `EgDataListRow` `contentStyle`（在默认 `padH` 上再 +26px，行宽/点按区与其它 DL 一致）。 */
export function teamSwitcherCreateRowContentStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  const layout = getTeamSwitcherDataListRowLayout(spacing);
  return {
    paddingLeft: layout.padH + teamSwitcherCreateRowExtraLeadingInset(spacing),
  };
}

/** 团队切换 · 行内左右与全站 DL 一致 · `spacing-3`（12px）。 */
export function getTeamSwitcherDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  return getDataListRowLayout(spacing);
}
