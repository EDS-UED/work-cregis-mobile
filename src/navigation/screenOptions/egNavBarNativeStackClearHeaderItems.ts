import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';

/** iOS 26+ 子页须显式清空右栏，避免首页 `unstable_headerRightItems` 残留（热更新后误触扫一扫等）。 */
export function egNavBarNativeStackClearHeaderItems(): Pick<
  NativeStackNavigationOptions,
  'unstable_headerLeftItems' | 'unstable_headerRightItems'
> {
  if (!shouldUseEgNavBarNativeStack()) {
    return {};
  }

  return {
    unstable_headerRightItems: () => [],
  };
}