import { create } from 'zustand';

import type { CurrencyUnit, LocaleCode, ThemePreference } from '@/types/app';

const STORAGE_KEYS = {
  locale: 'cregis-locale',
  theme: 'cregis-theme-preference',
  currency: 'cregis-currency-unit',
} as const;

const CURRENCY_UNITS: readonly CurrencyUnit[] = ['CNY', 'USD', 'HKD'];

function readCurrencyUnit(value: string | null): CurrencyUnit {
  return CURRENCY_UNITS.find((unit) => unit === value) ?? 'CNY';
}

type AppState = {
  locale: LocaleCode;
  themePreference: ThemePreference;
  currencyUnit: CurrencyUnit;
  globalLoading: boolean;
  reducedMotion: boolean;
  setLocale: (locale: LocaleCode) => void;
  setThemePreference: (theme: ThemePreference) => void;
  setCurrencyUnit: (currency: CurrencyUnit) => void;
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
  currencyUnit: 'CNY',
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
  setCurrencyUnit: (currencyUnit) => {
    void writePreference(STORAGE_KEYS.currency, currencyUnit);
    set({ currencyUnit });
  },
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  hydratePreferences: async () => {
    const [locale, theme, currency] = await Promise.all([
      readPreference(STORAGE_KEYS.locale),
      readPreference(STORAGE_KEYS.theme),
      readPreference(STORAGE_KEYS.currency),
    ]);

    set({
      locale: locale === 'en-US' || locale === 'zh-TW' ? locale : 'zh-CN',
      themePreference:
        theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system',
      currencyUnit: readCurrencyUnit(currency),
    });
  },
}));
