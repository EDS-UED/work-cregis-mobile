import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useDevInspectStore } from '@/store';

function Section({ title, lines }: { title: string; lines: string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {lines.length > 0 ? (
        lines.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))
      ) : (
        <Text style={styles.line}>—</Text>
      )}
    </View>
  );
}

export function InspectDetailPanel() {
  const selection = useDevInspectStore((state) => state.pinned);
  const clearPinned = useDevInspectStore((state) => state.clearPinned);

  if (!selection) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Inspect 模式：点选业务节点查看参数</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{selection.label}</Text>
        <Pressable onPress={clearPinned}>
          <Text style={styles.clear}>清除</Text>
        </Pressable>
      </View>

      <Section
        title="Motion"
        lines={
          selection.motionScene
            ? [
                `scene: ${selection.motionScene}`,
                selection.motionPreset ? `preset: ${selection.motionPreset}` : 'preset: —',
              ]
            : ['无']
        }
      />
      <Section title="Layout" lines={selection.layoutLines} />
      <Section title="Styles" lines={selection.styleLines} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: 320,
    backgroundColor: '#151920',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#2a3038',
  },
  panelContent: {
    padding: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  clear: {
    color: '#ffffff99',
    fontSize: 12,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    color: '#ffffffcc',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  line: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Menlo, monospace',
  },
  empty: {
    width: 320,
    padding: 16,
    backgroundColor: '#151920',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#2a3038',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#ffffff99',
    fontSize: 12,
  },
});
