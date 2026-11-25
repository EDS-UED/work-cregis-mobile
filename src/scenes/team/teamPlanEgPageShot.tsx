import type { EgPageShotProps, EgPageShotTriggerProps } from '@/eds/page-shot';
import {
  EgEdsAnimaPageShot,
  EgEdsAnimaPageShotTrigger,
} from '@/scenes/team/eds/TeamPlanEgEdsAnimaPageShot.js';

/** 团队套餐 / 订阅 page-shot · 无长按关页（停顶下拉关页 + 左缘侧滑保留）。 */
export function TeamPlanEgPageShot(props: EgPageShotProps) {
  return <EgEdsAnimaPageShot {...props} />;
}

/** 须与 `TeamPlanEgPageShot` 成对使用（同 Context）。 */
export function TeamPlanEgPageShotTrigger(props: EgPageShotTriggerProps) {
  return <EgEdsAnimaPageShotTrigger {...props} />;
}