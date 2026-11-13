import { useMemo } from 'react';
import { EgSymbol } from '@/eds/profile-icons';
import type { EgMenuItem } from '@/eds/menu';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useAppStore } from '@/store';
import type { LocaleCode, ThemePreference } from '@/types/app';
import { PersonalCenterAccountProfileRow } from '@/scenes/profile/PersonalCenterAccountProfileRow';
import { PersonalCenterMenuPickRow } from '@/scenes/profile/PersonalCenterMenuPickRow';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { PersonalCenterSettingsRow } from '@/scenes/profile/PersonalCenterSettingsRow';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';

const LOCALE_LABEL_KEY: Record<LocaleCode, `profile.${string}`> = {
  'zh-CN': 'profile.localeValueZhCN',
  'en-US': 'profile.localeValueEnUS',
  'zh-TW': 'profile.localeValueZhTW',
};

const THEME_LABEL_KEY: Record<ThemePreference, `profile.${string}`> = {
  system: 'profile.themeValueSystem',
  light: 'profile.themeValueLight',
  dark: 'profile.themeValueDark',
};

/** 个人中心 — 分组设置列表；栈动效见 `usePersonalCenterScreenOptions`。 */
export function PersonalCenterScene() {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const locale = useAppStore((state) => state.locale);
  const themePreference = useAppStore((state) => state.themePreference);
  const setLocale = useAppStore((state) => state.setLocale);
  const setThemePreference = useAppStore((state) => state.setThemePreference);

  const appearanceMenuItems = useMemo(
    (): EgMenuItem[] => [
      { id: 'system', label: t('profile.themeValueSystem') },
      { id: 'light', label: t('profile.themeValueLight') },
      { id: 'dark', label: t('profile.themeValueDark') },
    ],
    [t],
  );

  const languageMenuItems = useMemo(
    (): EgMenuItem[] => [
      { id: 'en-US', label: t('profile.localeValueEnUS') },
      { id: 'zh-CN', label: t('profile.localeValueZhCN') },
      { id: 'zh-TW', label: t('profile.localeValueZhTW') },
    ],
    [t],
  );

  const rowIcon = (
    <EgSymbol
      name="eds-pentagram"
      mode={mode}
      size="md"
      accessibilityLabel=""
    />
  );

  return (
    <SceneScaffold title={t('profile.title')} showNavBack pageBackground="card">
      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionAccount')}>
        <PersonalCenterAccountProfileRow />
        <PersonalCenterSettingsRow
          testID="profile-row-change-nickname"
          icon={rowIcon}
          label={t('profile.changeNickname')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionPreferences')}>
        <PersonalCenterMenuPickRow
          testID="profile-row-appearance"
          icon={rowIcon}
          label={t('profile.appearance')}
          value={t(THEME_LABEL_KEY[themePreference])}
          items={appearanceMenuItems}
          selectedId={themePreference}
          onSelect={(id) => setThemePreference(id as ThemePreference)}
        />
        <PersonalCenterMenuPickRow
          testID="profile-row-language"
          icon={rowIcon}
          label={t('profile.language')}
          value={t(LOCALE_LABEL_KEY[locale])}
          items={languageMenuItems}
          selectedId={locale}
          onSelect={(id) => setLocale(id as LocaleCode)}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-font-size"
          icon={rowIcon}
          label={t('profile.fontSize')}
          value={t('profile.fontSizeDefault')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-currency-unit"
          icon={rowIcon}
          label={t('profile.currencyUnit')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-timezone"
          icon={rowIcon}
          label={t('profile.timezone')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-mpc-network"
          icon={rowIcon}
          label={t('profile.mpcNetworkSettings')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionSecurity')}>
        <PersonalCenterSettingsRow
          testID="profile-row-identity"
          icon={rowIcon}
          label={t('profile.identityVerification')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-pin"
          icon={rowIcon}
          label={t('profile.pinCode')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-email"
          icon={rowIcon}
          label={t('profile.email')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-google-auth"
          icon={rowIcon}
          label={t('profile.googleAuthenticator')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-transaction-password"
          icon={rowIcon}
          label={t('profile.transactionPassword')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-device"
          icon={rowIcon}
          label={t('profile.device')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-biometric"
          icon={rowIcon}
          label={t('profile.biometric')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionCregis')}>
        <PersonalCenterSettingsRow
          testID="profile-row-customer-support"
          icon={rowIcon}
          label={t('profile.customerSupport')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-about"
          icon={rowIcon}
          label={t('profile.about')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}
