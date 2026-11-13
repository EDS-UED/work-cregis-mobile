import { useTranslation } from 'react-i18next';

import { ScanPageContent } from '@/scenes/home/ScanPageContent';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

/**
 * 扫码全屏（iOS 26+ 系统栏触发器不在 page-shot 上下文时的等价入口 · EDS page 推入）。
 * Android / overlay 顶栏仍走 page-shot。
 */
export function ScanScene() {
  const { t } = useTranslation();

  return (
    <SceneScaffold title={t('home.scan')} showNavBack>
      <ScanPageContent />
    </SceneScaffold>
  );
}
