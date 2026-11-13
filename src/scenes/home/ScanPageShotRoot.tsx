import { ScanPageContent } from '@/scenes/home/ScanPageContent';
import { ScanPageShell } from '@/scenes/scan/ScanPageShell';

/** 扫码 page-shot 根页 · 相机全屏铺底，顶栏由 page-shot 提供。 */
export function ScanPageShotRoot() {
  return (
    <ScanPageShell>
      <ScanPageContent showTopBar={false} />
    </ScanPageShell>
  );
}
