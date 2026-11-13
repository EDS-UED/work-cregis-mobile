import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { QUICK_SERVICE_DEFAULT_ICON } from '@/scenes/home/homeQuickServiceIcons';
import { edsPx } from '@/utils/edsTheme';

/** 团队中心 DL 行首图标 · 与快捷服务占位一致：`capsule-md` + `material-card-deep` + `eds-pentagram`。 */
export function TeamCenterMenuLeadIcon() {
  const { mode, colors, spacing } = useEdsTheme();
  const slot = edsPx(spacing['capsule-md']);
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
        name={QUICK_SERVICE_DEFAULT_ICON}
        mode={mode}
        size="md"
        fillTone="primary"
        accessibilityLabel=""
      />
    </View>
  );
}
