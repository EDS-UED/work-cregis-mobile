import { useColorScheme } from 'react-native';
import { resolveThemeMode as edsResolveThemeMode, type ThemeMode } from '@/eds/theme';

import { useAppStore } from '@/store';
import { getCregisThemeColors } from '@/utils/edsTheme';

function resolveThemeMode(
  systemScheme: 'light' | 'dark' | null,
): ThemeMode {
  if (typeof edsResolveThemeMode === 'function') {
    return edsResolveThemeMode(systemScheme);
  }
  return systemScheme === 'dark' ? 'dark' : 'light';
}

export function useEffectiveThemeMode(): ThemeMode {
  const preference = useAppStore((state) => state.themePreference);
  const systemScheme = useColorScheme();

  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return resolveThemeMode(
    systemScheme === 'light' || systemScheme === 'dark' ? systemScheme : null,
  );
}

export function useThemeColors() {
  const mode = useEffectiveThemeMode();
  return getCregisThemeColors(mode);
}
