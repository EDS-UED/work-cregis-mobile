import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useEffectiveTheme';

type SceneScaffoldProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function SceneScaffold({ title, subtitle, children }: SceneScaffoldProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.page }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors['text-base-primary'] }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors['text-base-secondary'] }]}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { gap: 4, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, lineHeight: 20 },
});
