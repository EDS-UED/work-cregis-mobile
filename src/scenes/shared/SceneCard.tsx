import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useEffectiveTheme';
import type { InspectSelection } from '@/store';
import { InspectTarget } from '@/scenes/shared/InspectTarget';

type SceneCardProps = PropsWithChildren<{
  title: string;
  inspect: InspectSelection;
  onPress?: () => void;
}>;

export function SceneCard({ title, inspect, onPress, children }: SceneCardProps) {
  const colors = useThemeColors();

  return (
    <InspectTarget inspect={inspect} onPress={onPress}>
      <View style={[styles.card, { backgroundColor: colors['material-card-shallow'], borderColor: colors['stroke-divider'] }]}>
        <Text style={[styles.title, { color: colors['text-base-primary'] }]}>{title}</Text>
        {children}
      </View>
    </InspectTarget>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
