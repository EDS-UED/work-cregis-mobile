import mobileTheme from '@/eds/tokens';
import { edsPx } from '@/utils/edsTheme';

export type TeamCenterPlanCardSize = {
  width: number;
  height: number;
};

/** 套餐卡最近一次 `onLayout` · 账户版本下卡扫光与套餐卡同几何。 */
let lastMeasuredPlanCardSize: TeamCenterPlanCardSize = { width: 0, height: 0 };

export function getTeamCenterPlanCardLastSize(): TeamCenterPlanCardSize {
  return lastMeasuredPlanCardSize;
}

export function setTeamCenterPlanCardLastSize(size: TeamCenterPlanCardSize): void {
  if (size.width > 0 && size.height > 0) {
    lastMeasuredPlanCardSize = size;
  }
}

/** 无实测时 · 按套餐卡 shell 内边距 + 正文区估算高（与真卡同 order）。 */
function fallbackPlanCardSheenRefHeight(): number {
  const spacing = mobileTheme.spacing;
  const padY =
    edsPx(spacing['spacing-5']) +
    edsPx(spacing['spacing-6']);
  const titleBlock =
    edsPx(spacing['spacing-1-5']) +
    edsPx(spacing['spacing-7']) +
    56;
  const actions = 32;
  return padY + titleBlock + actions;
}

/** 扫光光带几何：优先套餐卡实测，否则宽用视口、高不低于套餐卡参考高。 */
export function resolveTeamPlanCardSheenBandLayout(
  viewportWidth: number,
  viewportHeight: number,
): TeamCenterPlanCardSize {
  const measured = getTeamCenterPlanCardLastSize();
  if (measured.width > 0 && measured.height > 0) {
    return measured;
  }
  const refHeight = Math.max(viewportHeight, fallbackPlanCardSheenRefHeight());
  return {
    width: viewportWidth,
    height: refHeight,
  };
}