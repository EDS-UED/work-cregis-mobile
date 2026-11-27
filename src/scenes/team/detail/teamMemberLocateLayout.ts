import {
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';
import type mobileTheme from '@/eds/tokens';
import { edsNavContentGap } from '@/utils/edsTheme';

/** 与 {@link SceneScaffold} 正文 `paddingTop` 同源 · Showcase `ShowcaseLocateDemoView` `EgLocate` `top`。 */
export function teamMemberLocateRailInsetTop(
  spacing: typeof mobileTheme.spacing,
  safeAreaTop: number,
  navToContentGap?: number,
): number {
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const resolvedNavToContentGap = navToContentGap ?? edsNavContentGap(spacing);
  if (nativeNavBar) {
    return resolvedNavToContentGap;
  }
  return egNavBarScrollContentReserve(safeAreaTop) + resolvedNavToContentGap;
}