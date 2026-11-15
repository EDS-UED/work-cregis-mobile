import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgItemGroup } from '@/eds/item';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type PersonalCenterSettingsGroupProps = {
  sectionTitle: string;
  children: ReactNode;
};

export function PersonalCenterSettingsGroup({
  sectionTitle,
  children,
}: PersonalCenterSettingsGroupProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: edsPx(spacing['spacing-2']),
          marginBottom: edsPx(spacing['spacing-4']),
        },
        sectionTitle: {
          marginLeft: edsPx(spacing['spacing-5']),
        },
      }),
    [spacing],
  );

  return (
    <View style={styles.section}>
      <SceneText
        variant="bodySmallSemibold"
        style={[styles.sectionTitle, { color: colors['text-base-secondary'] }]}
      >
        {sectionTitle}
      </SceneText>
      <EgItemGroup mode={mode}>{children}</EgItemGroup>
    </View>
  );
}