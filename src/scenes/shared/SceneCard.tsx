import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useEdsTypography } from '@/hooks/useEdsTypography';
import { edsPx } from '@/utils/edsTheme';

type SceneCardProps = PropsWithChildren<{
  title: string;
  onPress?: () => void;
}>;

export function SceneCard({ title, onPress, children }: SceneCardProps) {
  const colors = useThemeColors();
  const { spacing } = useEdsTheme();
  const text = useEdsTypography();

  const card = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors['material-card-shallow'],
          borderColor: colors['stroke-divider'],
          padding: edsPx(spacing['spacing-4']),
          gap: edsPx(spacing['spacing-2']),
          borderRadius: edsPx(spacing['radius-lg']),
        },
      ]}
    >
      <Text style={[text.bodySemibold, { color: colors['text-base-primary'] }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  if (!onPress) {
    return card;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {card}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.92,
  },
});
