import { create } from 'zustand';

import type { DevicePresetId, LocaleCode, PreviewMode, ThemePreference } from '@/types/app';

const STORAGE_KEYS = {
  locale: 'cregis-locale',
  theme: 'cregis-theme-preference',
} as const;

type AppState = {
  locale: LocaleCode;
  themePreference: ThemePreference;
  globalLoading: boolean;
  previewMode: PreviewMode;
  devicePreset: DevicePresetId;
  reducedMotion: boolean;
  setLocale: (locale: LocaleCode) => void;
  setThemePreference: (theme: ThemePreference) => void;
  setGlobalLoading: (loading: boolean) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setDevicePreset: (preset: DevicePresetId) => void;
  setReducedMotion: (enabled: boolean) => void;
  hydratePreferences: () => Promise<void>;
};

async function readPreference(key: string): Promise<string | null> {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }

  try {
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writePreference(key: string, value: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
    return;
  }

  try {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(key, value);
  } catch {
    // noop — preferences fall back to in-memory state
  }
}

export const useAppStore = create<AppState>((set) => ({
  locale: 'zh-CN',
  themePreference: 'system',
  globalLoading: false,
  previewMode: 'preview',
  devicePreset: 'iphone',
  reducedMotion: false,
  setLocale: (locale) => {
    void writePreference(STORAGE_KEYS.locale, locale);
    set({ locale });
  },
  setThemePreference: (themePreference) => {
    void writePreference(STORAGE_KEYS.theme, themePreference);
    set({ themePreference });
  },
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setDevicePreset: (devicePreset) => set({ devicePreset }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  hydratePreferences: async () => {
    const [locale, theme] = await Promise.all([
      readPreference(STORAGE_KEYS.locale),
      readPreference(STORAGE_KEYS.theme),
    ]);

    set({
      locale: locale === 'en-US' || locale === 'zh-TW' ? locale : 'zh-CN',
      themePreference:
        theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system',
    });
  },
}));
