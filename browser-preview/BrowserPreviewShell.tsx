import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DeviceFrame } from './DeviceFrame';
import { devicePresets } from './devicePresets';
import { InspectDetailPanel } from '../dev-mode/InspectDetailPanel';
import { useAppStore } from '@/store';
import type { PreviewMode } from '@/types/app';

type BrowserPreviewShellProps = PropsWithChildren;

export function BrowserPreviewShell({ children }: BrowserPreviewShellProps) {
  const { t } = useTranslation();
  const previewMode = useAppStore((state) => state.previewMode);
  const devicePreset = useAppStore((state) => state.devicePreset);
  const setPreviewMode = useAppStore((state) => state.setPreviewMode);
  const setDevicePreset = useAppStore((state) => state.setDevicePreset);

  const modes: PreviewMode[] = ['preview', 'inspect'];

  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <Text style={styles.brand}>cregis · Browser Preview</Text>
        <View style={styles.modeRow}>
          {modes.map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setPreviewMode(mode)}
              style={[styles.modeChip, previewMode === mode && styles.modeChipActive]}
            >
              <Text style={styles.modeText}>{t(`preview.${mode}`)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.presetRow}>
          {devicePresets.map((preset) => (
            <Pressable
              key={preset.id}
              onPress={() => setDevicePreset(preset.id)}
              style={[styles.presetChip, devicePreset === preset.id && styles.presetChipActive]}
            >
              <Text style={styles.presetText}>{preset.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.bodyRow}>
        <DeviceFrame presetId={devicePreset}>{children}</DeviceFrame>
        {previewMode === 'inspect' ? <InspectDetailPanel /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    backgroundColor: '#111418',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a3038',
  },
  brand: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1f242d',
  },
  modeChipActive: {
    backgroundColor: '#5f2243',
  },
  modeText: {
    color: '#fff',
    fontSize: 12,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1f242d',
  },
  presetChipActive: {
    backgroundColor: '#003a6d',
  },
  presetText: {
    color: '#fff',
    fontSize: 11,
  },
});
