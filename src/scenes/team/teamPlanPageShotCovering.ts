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

/** 按下触发器即暂停列表扫光，减少入场首帧与 `morph` 叠层的绘制。 */
export function armTeamPlanPageShotCovering() {
  useTeamPlanPageShotCovering.getState().setActive(true);
}