import { Children, cloneElement, isValidElement, type PropsWithChildren, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { shouldUseEgNavBarNativeStack } from '@/eds/nav-bar';
import { EgEdsAnimaPageShotTrigger } from '@/eds/page-shot';

import { HOME_SCAN_PAGE_SHOT_ID } from '@/scenes/home/homeScanPageShot';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';

type GlassPressChild = ReactElement<{ onPress?: () => void }>;

/** 首页扫码胶囊 · overlay 内 page-shot；iOS 26+ 系统栏在 shot 上下文外 → Stack `Scan`。 */
export function HomeScanPageShotTrigger({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const navigation = useHomeStackNavigation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();

  if (nativeNavBar) {
    const child = Children.only(children);
    if (!isValidElement(child)) {
      return children;
    }
    return cloneElement(child as GlassPressChild, {
      onPress: () => navigation.navigate('Scan'),
    });
  }

  return (
    <EgEdsAnimaPageShotTrigger
      id={HOME_SCAN_PAGE_SHOT_ID}
      radius="capsule"
      morph
      accessibilityLabel={t('home.scan')}
    >
      {children}
    </EgEdsAnimaPageShotTrigger>
  );
}
