import type { DevicePresetId } from '@/types/app';

export type DevicePreset = {
  id: DevicePresetId;
  label: string;
  width: number;
  height: number;
  pixelRatio: number;
};

export const devicePresets: DevicePreset[] = [
  { id: 'iphone', label: 'iPhone', width: 390, height: 844, pixelRatio: 3 },
  { id: 'iphone-pro', label: 'iPhone Pro', width: 402, height: 874, pixelRatio: 3 },
  { id: 'iphone-pro-max', label: 'iPhone Pro Max', width: 430, height: 932, pixelRatio: 3 },
  { id: 'android', label: 'Android', width: 412, height: 915, pixelRatio: 2.625 },
  { id: 'android-small', label: 'Small Android', width: 360, height: 800, pixelRatio: 2 },
];

export function getDevicePreset(id: DevicePresetId): DevicePreset {
  return devicePresets.find((preset) => preset.id === id) ?? devicePresets[0];
}
