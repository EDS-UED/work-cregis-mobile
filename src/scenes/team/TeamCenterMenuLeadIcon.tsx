import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

type TeamCenterMenuLeadIconProps = {
  icon: string;
};

/** 团队中心 DL 行首 · `material-card-deep` 底 · 线框 · `symbol-sm` · `stroke-base-primary`。 */
export function TeamCenterMenuLeadIcon({ icon }: TeamCenterMenuLeadIconProps) {
  const { mode, colors, spacing } = useEdsTheme();
  const slot = edsPx(spacing['capsule-md']);
  const iconPx = edsPx(spacing['symbol-sm']);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          width: slot,
          height: slot,
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: String(colors['material-card-deep']),
        },
      }),
    [colors, slot, spacing],
  );

  return (
    <View style={styles.shell}>
      <EgSymbol
        name={icon}
        mode={mode}
        displayPx={iconPx}
        strokeColorToken="stroke-base-primary"
        accessibilityLabel=""
      />
    </View>
  );
}
