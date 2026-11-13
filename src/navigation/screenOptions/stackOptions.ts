import { EgEdsAnimaPage } from '@/eds/page-motion';
import { edsPagePushedScreenOptions, edsPageRootScreenOptions } from '@/navigation/screenOptions/edsPageStackNavigatorConfig';

/** Tab / Stack 根屏 — 无下层压暗（RN 栈 `cardOverlayEnabled`）。 */
export { edsPageRootScreenOptions, edsPagePushedScreenOptions };

/** 纵向全屏推入（modal 形态页）— 传入 Stack `screenOptions` 工厂。 */
export function cregisModalPageScreenOptions(mode: 'light' | 'dark' = 'light') {
  return EgEdsAnimaPage({ direction: 'vertical', mode });
}
