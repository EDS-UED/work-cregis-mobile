import type { EgEdsAnimaPageShotRootApi } from '@/eds/page-shot';

import { ScanPageContent } from '@/scenes/home/ScanPageContent';

type ScanPageShotRootProps = {
  api: EgEdsAnimaPageShotRootApi;
};

/** 扫码 page-shot 根页。 */
export function ScanPageShotRoot({ api }: ScanPageShotRootProps) {
  return <ScanPageContent contentStyle={{ paddingTop: api.scrollTopInset }} />;
}
