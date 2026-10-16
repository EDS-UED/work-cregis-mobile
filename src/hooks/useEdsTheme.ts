import { mobileTheme } from '@eds-evergreen/mobile';

import { useEffectiveThemeMode } from '@/hooks/useEffectiveTheme';
import { getCregisThemeColors } from '@/utils/edsTheme';

export function useEdsTheme() {
  const mode = useEffectiveThemeMode();

  return {
    mode,
    colors: getCregisThemeColors(mode),
    spacing: mobileTheme.spacing,
    typography: mobileTheme.typography.base,
  };
}
