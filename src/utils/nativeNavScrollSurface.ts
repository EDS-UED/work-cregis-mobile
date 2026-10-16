import type { ViewStyle } from 'react-native';
import type { getThemeColors } from '@eds-evergreen/mobile';

import { edsPageBackground } from '@/utils/edsTheme';

type ThemeColors = ReturnType<typeof getThemeColors>;

/** iOS 26+ 主 ScrollView — 页面 `box-page` + 系统栏 scroll edge 采样（勿包 `EdsGlassScreenShell`）。 */
export function nativeNavScrollSurfaceStyle(colors: ThemeColors): ViewStyle {
  return {
    flex: 1,
    backgroundColor: edsPageBackground(colors),
  };
}
