import { create } from 'zustand';

import type { MotionPresetKey, MotionScene } from '@/types/app';

export type InspectSelection = {
  label: string;
  motionScene: MotionScene | null;
  motionPreset: MotionPresetKey | null;
  layoutLines: string[];
  styleLines: string[];
};

type DevInspectState = {
  pinned: InspectSelection | null;
  hover: InspectSelection | null;
  setHover: (selection: InspectSelection | null) => void;
  pinSelection: (selection: InspectSelection) => void;
  clearPinned: () => void;
};

export const useDevInspectStore = create<DevInspectState>((set) => ({
  pinned: null,
  hover: null,
  setHover: (hover) => set({ hover }),
  pinSelection: (pinned) => set({ pinned }),
  clearPinned: () => set({ pinned: null }),
}));
