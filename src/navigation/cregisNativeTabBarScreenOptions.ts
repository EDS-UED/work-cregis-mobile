import { CREGIS_TAB_BAR_NATIVE_TABS } from '@/eds/cregis-tab-bar';
import type { ThemeMode } from '@/eds/theme';

import { getCregisThemeColors } from '@/utils/edsTheme';

/** iOS 26+ 系统 Tab — 选中 tint 对齐 `--material-decor`。 */
export function cregisNativeTabBarScreenOptions({ mode = 'light' }: { mode?: ThemeMode } = {}) {
  const activeTint = String(getCregisThemeColors(mode)['material-decor']);
  return ({ route }: { route: { name: string } }) => {
    const tab = CREGIS_TAB_BAR_NATIVE_TABS.find((t) => t.routeName === route.name);
    const src = tab?.icon?.src;
    return {
      title: tab?.label ?? route.name,
      headerShown: false as const,
      tabBarIcon: ({ focused }: { focused: boolean }) => ({
        type: 'image' as const,
        source: (focused ? src?.selected : src?.default) ?? 0,
      }),
      tabBarActiveTintColor: activeTint,
    };
  };
}
