import type { ViewStyle } from 'react-native';

import {
  getDataListRowLayout,
  type DataListRowLayout,
} from '@/scenes/shared/dataListLayout';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';
import type mobileTheme from '@/eds/tokens';

/** TeamCenter · 列表左缘距屏 `spacing-2`（8px）。 */
export function teamCenterListEdgeFromScreen(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-2']);
}

/** 团队中心 DL · 行首圆标 ↔ 文案 `spacing-3`（12px）。 */
export function teamCenterDataListMediaGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-3']);
}

/** 同组菜单行纵向间距 · `spacing-1`（4px）。 */
export function teamCenterDataListGroupStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  return { gap: edsPx(spacing['spacing-1']) };
}

/** TeamCenter · 列表区相对 Scene 水平 padding，使行壳左缘距屏 `spacing-2`（8px）。 */
export function teamCenterDataListSectionStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  const sceneInset = edsSceneContentInset(spacing);
  const screenEdge = teamCenterListEdgeFromScreen(spacing);
  return {
    marginHorizontal: screenEdge - sceneInset,
    alignSelf: 'stretch',
    overflow: 'visible',
    gap: 0,
  };
}

/**
 * TeamCenter · Data list 页面例外（`docs/design.md` §3.4）
 * 列表距屏左右 8px；媒体 ↔ 文案 `spacing-3`（12px）；行内 padH 12 / padV 12 等同通用 DL。
 */
export function getTeamCenterDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  const base = getDataListRowLayout(spacing);
  const screenEdge = teamCenterListEdgeFromScreen(spacing);
  /** 区左缘已在 8px，行外 margin 置 0，避免再叠通用 `spacing-1`。 */
  const marginH = 0;
  const rowGap = edsPx(spacing['spacing-0']);
  return {
    ...base,
    marginH,
    slack: rowGap,
    contentInsetFromScreen: screenEdge + marginH + base.padH,
    /** 与通用 DL · 主副文案 `spacing-05`（2px） */
    titleSubGap: edsPx(spacing['spacing-05']),
  };
}
