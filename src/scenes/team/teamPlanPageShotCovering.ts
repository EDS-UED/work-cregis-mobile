import { create } from 'zustand';

/** 套餐 page-shot 呈现中 · 列表触发器扫光等非必要动效暂停，减轻跟手缩放掉帧。 */
type TeamPlanPageShotCoveringState = {
  active: boolean;
  setActive: (active: boolean) => void;
};

export const useTeamPlanPageShotCovering = create<TeamPlanPageShotCoveringState>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));

/** 订阅页展开期间暂停列表扫光。收起必须配对放开，否则默认卡光带不再绘制。 */
export function armTeamPlanPageShotCovering() {
  useTeamPlanPageShotCovering.getState().setActive(true);
}

export function releaseTeamPlanPageShotCovering() {
  useTeamPlanPageShotCovering.getState().setActive(false);
}