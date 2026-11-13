import type { ViewStyle } from 'react-native';

import mobileTheme from '@/eds/tokens';

import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

/** Data list 点按缩放 · 与 `HomeTodoRow` 一致（`scale-press-down-xs`）。 */
export const DL_PRESS_DOWN_XS =
  mobileTheme.motion.scale['scale-press-down-xs'] as number;

/** Data list 点按动效档位 · `useEdsTapPressMotion(DL_PRESS_INTENSITY)`。 */
export const DL_PRESS_INTENSITY = 'xs' as const;

/** 估算行高 · 用于 scale 留白（与首页待办行一致）。 */
export const DL_ROW_LAYOUT_HEIGHT = 72;

export function dlPressScaleSlack(
  layoutPx: number = DL_ROW_LAYOUT_HEIGHT,
  activeScale: number = DL_PRESS_DOWN_XS,
) {
  return Math.max(1, Math.ceil((layoutPx * Math.abs(activeScale - 1)) / 2) + 1);
}

export type DataListRowLayout = {
  /** 行内左右 · `spacing-3`（12px） */
  padH: number;
  /** 行内上下 · `spacing-3`（12px） */
  padV: number;
  /** 行壳（点按底）距屏幕左右 · `spacing-2`（8px）· 配合 DL-bleed */
  marginH: number;
  /** 行内主内容与尾标等 · `spacing-1`（4px） */
  contentGap: number;
  /** 主文案距屏幕水平边缘 · `marginH + padH` */
  contentInsetFromScreen: number;
  /** 圆角 · `radius-md`（与 Showcase · list row 一致） */
  radius: number;
  /** scale 动效上下留白 */
  slack: number;
  sceneInset: number;
  /** 主副文案纵向间距 · `spacing-05`（2px） */
  titleSubGap: number;
};

/**
 * 全站默认 Data list 行几何（通用规则 · `docs/design.md` §3）。
 * 单页例外勿改此函数默认值 — 在对应 Scene 局部覆盖。
 */
export function getDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  const sceneInset = edsSceneContentInset(spacing);
  const padH = edsPx(spacing['spacing-3']);
  const padV = edsPx(spacing['spacing-3']);
  const marginH = edsPx(spacing['spacing-2']);
  const contentGap = edsPx(spacing['spacing-1']);
  const titleSubGap = edsPx(spacing['spacing-05']);
  return {
    padH,
    padV,
    marginH,
    contentGap,
    radius: edsPx(spacing['radius-md']),
    /** 列表 `gap` 已用 `dataListRowGap`（4px）· 不再叠加 scale 上下留白，避免行间视觉 ~8px。 */
    slack: 0,
    sceneInset,
    contentInsetFromScreen: marginH + padH,
    titleSubGap,
  };
}

/** DL-row · 行壳（点按区域）距屏幕左右 · `marginH` · `spacing-2`（8px）。 */
export function dataListRowShellInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return getDataListRowLayout(spacing).marginH;
}

/** DL-screen · 主文案距屏幕左右 · `marginH + padH`（默认 8+12=20px）。 */
export function dataListScreenInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return getDataListRowLayout(spacing).contentInsetFromScreen;
}

/** DL 行与行 · `spacing-1`（4px）。 */
export function dataListRowGap(
  spacing: typeof mobileTheme.spacing,
): number {
  return edsPx(spacing['spacing-1']);
}

/**
 * **DL-bleed** · 抵消父级 Scene `spacing-5`；列表行间距 `dataListRowGap`。
 */
export function dataListSectionStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  const sceneInset = edsSceneContentInset(spacing);
  return {
    marginHorizontal: -sceneInset,
    alignSelf: 'stretch',
    overflow: 'visible',
    gap: dataListRowGap(spacing),
  };
}
