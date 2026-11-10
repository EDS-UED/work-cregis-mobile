import { useMemo } from 'react';

import { useEdsFontEpoch } from '@/hooks/EdsFontEpochContext';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { createEdsTypographyStyles } from '@/utils/edsTheme';

export function useEdsTypography() {
  const { colors, typography } = useEdsTheme();
  const fontEpoch = useEdsFontEpoch();
  return useMemo(
    () => createEdsTypographyStyles(colors, typography),
    [colors, typography, fontEpoch],
  );
}
