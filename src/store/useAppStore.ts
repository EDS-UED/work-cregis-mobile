import { create } from 'zustand';

import type { LocaleCode, ThemePreference } from '@/types/app';

const STORAGE_KEYS = {
  locale: 'cregis-locale',
  theme: 'cregis-theme-preference',
} as const;

type AppState = {
  locale: LocaleCode;
  themePreference: ThemePreference;
  globalLoading: boolean;
  reducedMotion: boolean;
  setLocale: (locale: LocaleCode) => void;
  setThemePreference: (theme: ThemePreference) => void;
  setGlobalLoading: (loading: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  hydratePreferences: () => Promise<void>;
};

async function readPreference(key: string): Promise<string | null> {
  try {
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writePreference(key: string, value: string): Promise<void> {
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
