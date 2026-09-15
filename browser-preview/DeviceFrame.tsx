import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getDevicePreset } from './devicePresets';
import type { DevicePresetId } from '@/types/app';

type DeviceFrameProps = PropsWithChildren<{
  presetId: DevicePresetId;
}>;

export function DeviceFrame({ presetId, children }: DeviceFrameProps) {
  const preset = getDevicePreset(presetId);

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.device,
          {
            width: preset.width,
            height: preset.height,
          },
        ]}
      >
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>9:41</Text>
          <Text style={styles.statusText}>100%</Text>
        </View>
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111418',
    padding: 24,
  },
  device: {
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 8,
    borderColor: '#1f242d',
  },
  statusBar: {
    height: 28,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#020304',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
