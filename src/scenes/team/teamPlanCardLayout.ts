/** page-shot 根页首帧 · 沿用触发器上次实测尺寸，避免 backdrop 重算闪动。 */
let lastCardSize = { width: 0, height: 0 };

/** 订阅 Hero 带上次 band 高度 · 二次入场避免 SVG 高度跳变。 */
let lastHeroBandHeight = 0;

export function getTeamPlanCardLastLayoutSize() {
  return lastCardSize;
}

export function setTeamPlanCardLastLayoutSize(size: { width: number; height: number }) {
  lastCardSize = size;
}

export function getTeamPlanPageShotHeroBandHeight() {
  return lastHeroBandHeight;
}

export function setTeamPlanPageShotHeroBandHeight(height: number) {
  lastHeroBandHeight = height;
}