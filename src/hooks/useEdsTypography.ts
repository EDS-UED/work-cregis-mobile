import { useMemo } from 'react';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { createEdsTypographyStyles } from '@/utils/edsTheme';

export function useEdsTypography() {
  const { colors, typography } = useEdsTheme();
  return useMemo(() => createEdsTypographyStyles(colors, typography), [colors, typography]);
}
