import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BiometricPromptSheet } from '@/scenes/profile/BiometricPromptSheet';
import { SceneCard } from '@/scenes/shared/SceneCard';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { useBiometricPrompt } from '@/hooks/useBiometricPrompt';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { biometricsService } from '@/services/biometrics';
import { useAppStore, useAuthStore, useProfileStore } from '@/store';
import type { LocaleCode, ThemePreference } from '@/types/app';

const locales: LocaleCode[] = ['zh-CN', 'en-US', 'zh-TW'];
const themes: ThemePreference[] = ['light', 'dark', 'system'];

export function ProfileScene() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const locale = useAppStore((state) => state.locale);
  const themePreference = useAppStore((state) => state.themePreference);
  const setLocale = useAppStore((state) => state.setLocale);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const setBiometricsEnabled = useProfileStore((state) => state.setBiometricsEnabled);
  const biometricPrompt = useBiometricPrompt();

  const handleBiometrics = async () => {
    biometricPrompt.open();
    const result = await biometricsService.authenticate('Authenticate with biometrics');
    biometricPrompt.close();
    if (result.success) {
      setBiometricsEnabled(true);
    }
  };

  return (
    <SceneScaffold title={t('scenes.profileTitle')} subtitle={t('scenes.profileSubtitle')}>
      <SceneCard
        title={t('profile.locale')}
        inspect={{
          label: 'ProfileLocaleSetting',
          motionScene: null,
          motionPreset: null,
          layoutLines: ['gap: var(--spacing-2)'],
          styleLines: [],
        }}
      >
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {locales.map((code) => (
            <Pressable key={code} onPress={() => { setLocale(code); void i18n.changeLanguage(code); }}>
              <Text style={{ color: locale === code ? colors.brand : colors['text-base-secondary'] }}>{code}</Text>
            </Pressable>
          ))}
        </View>
      </SceneCard>

      <SceneCard
        title={t('profile.theme')}
        inspect={{
          label: 'ProfileThemeSetting',
          motionScene: null,
          motionPreset: 'timing.easeInOut',
          layoutLines: ['gap: var(--spacing-2)'],
          styleLines: [],
        }}
      >
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {themes.map((theme) => (
            <Pressable key={theme} onPress={() => setThemePreference(theme)}>
              <Text style={{ color: themePreference === theme ? colors.brand : colors['text-base-secondary'] }}>
                {theme === 'light'
                  ? t('profile.themeLight')
                  : theme === 'dark'
                    ? t('profile.themeDark')
                    : t('profile.themeSystem')}
              </Text>
            </Pressable>
          ))}
        </View>
      </SceneCard>

      <SceneCard
        title={t('profile.biometrics')}
        onPress={() => void handleBiometrics()}
        inspect={{
          label: 'BiometricPromptTrigger',
          motionScene: 'motion-flotation',
          motionPreset: 'spring.default',
          layoutLines: ['padding: var(--spacing-4)'],
          styleLines: [],
        }}
      >
        <Text>{t('profile.biometricsMock')}</Text>
      </SceneCard>

      <Pressable
        onPress={() => (isAuthenticated ? signOut() : signIn('Mock User'))}
        style={{ paddingVertical: 8 }}
      >
        <Text style={{ color: colors.brand }}>
          {isAuthenticated ? t('profile.signOut') : t('profile.signIn')}
        </Text>
      </Pressable>

      <BiometricPromptSheet
        visible={biometricPrompt.visible}
        onClose={biometricPrompt.close}
        motionScene={biometricPrompt.motionScene}
        motionPreset={biometricPrompt.motionPreset}
      />
    </SceneScaffold>
  );
}
