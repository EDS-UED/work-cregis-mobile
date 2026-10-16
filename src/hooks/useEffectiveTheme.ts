import { useColorScheme } from 'react-native';
import { resolveThemeMode, type ThemeMode } from '@eds-evergreen/mobile';

import { useAppStore } from '@/store';
import { getCregisThemeColors } from '@/utils/edsTheme';

export function useEffectiveThemeMode(): ThemeMode {
  const preference = useAppStore((state) => state.themePreference);
  const systemScheme = useColorScheme();

  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return resolveThemeMode(systemScheme === 'unspecified' ? null : systemScheme);
}

export function useThemeColors() {
  const mode = useEffectiveThemeMode();
  return getCregisThemeColors(mode);
}
