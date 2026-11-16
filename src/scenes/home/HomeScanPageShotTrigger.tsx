import { Children, cloneElement, isValidElement, type PropsWithChildren, type ReactElement } from 'react';

import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';

type GlassPressChild = ReactElement<{ onPress?: () => void }>;

/**
 * 首页扫码胶囊。
 * iOS 26+ 系统栏在 page-shot 上下文外；overlay 内 `EgButtonGlass` 内层 Pressable 无 `onPress` 会吞触摸。
 * 统一 Stack 推入 `Scan`（`ScanScene` + `ScanTopBar`）。
 */
export function HomeScanPageShotTrigger({ children }: PropsWithChildren) {
  const navigation = useHomeStackNavigation();
  const child = Children.only(children);
  if (!isValidElement(child)) {
    return children;
  }
  return cloneElement(child as GlassPressChild, {
    onPress: () => navigation.navigate('Scan'),
  });
}