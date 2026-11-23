/** page-shot 根页首帧 · 沿用触发器上次实测尺寸，避免 backdrop 重算闪动。 */
let lastCardSize = { width: 0, height: 0 };

export function getTeamPlanCardLastLayoutSize() {
  return lastCardSize;
}

export function setTeamPlanCardLastLayoutSize(size: { width: number; height: number }) {
  lastCardSize = size;
}