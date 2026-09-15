import { create } from 'zustand';

type ProfileState = {
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  biometricsEnabled: false,
  setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
}));
