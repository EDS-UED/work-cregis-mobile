import { useCallback, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EgEdsAnimaPageShot,
  type EgEdsAnimaPageShotRootApi,
  type EgEdsAnimaPageShotSource,
} from '@/eds/page-shot';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { ScanPageShotRoot } from '@/scenes/home/ScanPageShotRoot';
import { HOME_SCAN_PAGE_SHOT_ID } from '@/scenes/home/homeScanPageShot';

/** 对比页 · page-shot 宿主快照。 */
export function CompareHomeTodoDividerPageShotHost({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  const renderRoot = useCallback((_api: EgEdsAnimaPageShotRootApi) => <ScanPageShotRoot />, []);

  const title = useCallback(
    (source: EgEdsAnimaPageShotSource, pageKey: string | null) =>
      pageKey === null && source.id === HOME_SCAN_PAGE_SHOT_ID ? t('home.scan') : undefined,
    [t],
  );

  return (
    <EgEdsAnimaPageShot mode={mode} title={title} renderRoot={renderRoot}>
      {children}
    </EgEdsAnimaPageShot>
  );
}
