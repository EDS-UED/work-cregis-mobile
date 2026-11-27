import { useCallback, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { EgPageShot, type EgPageShotRootApi, type EgPageShotSource } from '@/eds/page-shot';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { ScanPageShotRoot } from '@/scenes/home/ScanPageShotRoot';
import { HOME_SCAN_PAGE_SHOT_ID } from '@/scenes/home/homeScanPageShot';

/** 首页 · page-shot 宿主（顶栏扫码触发 · 不包 Stack Nav）。 */
export function HomePageShotHost({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  const renderRoot = useCallback((_api: EgPageShotRootApi) => <ScanPageShotRoot />, []);

  const title = useCallback(
    (source: EgPageShotSource, pageKey: string | null) =>
      pageKey ?? (source.id === HOME_SCAN_PAGE_SHOT_ID ? t('home.scan') : undefined),
    [t],
  );

  return (
    <EgPageShot mode={mode} title={title} renderRoot={renderRoot}>
      {children}
    </EgPageShot>
  );
}
