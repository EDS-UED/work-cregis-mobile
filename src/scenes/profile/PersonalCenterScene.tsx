import { useMemo } from 'react';
import { EgSymbol } from '@/eds/profile-icons';
import type { EgMenuItem } from '@/eds/menu';
import { EgItem } from '@/eds/item';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useAppStore } from '@/store';
import type { LocaleCode, ThemePreference } from '@/types/app';
import { PersonalCenterAccountProfileRow } from '@/scenes/profile/PersonalCenterAccountProfileRow';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
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
        <EgItem
          testID="profile-row-change-nickname"
          mode={mode}
          icon={rowIcon}
          label={t('profile.changeNickname')}
          showChevron
          onPress={() => undefined}
          showDivider={false}
          accessibilityLabel={t('profile.changeNickname')}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionPreferences')}>
        <EgItem
          testID="profile-row-appearance"
          mode={mode}
          icon={rowIcon}
          label={t('profile.appearance')}
          value={t(THEME_LABEL_KEY[themePreference])}
          trailingDisplay="menu"
          menuItems={appearanceMenuItems}
          selectedMenuId={themePreference}
          onMenuSelect={(id) => setThemePreference(id as ThemePreference)}
          showDivider
          accessibilityLabel={t('profile.appearance')}
        />
        <EgItem
          testID="profile-row-language"
          mode={mode}
          icon={rowIcon}
          label={t('profile.language')}
          value={t(LOCALE_LABEL_KEY[locale])}
          trailingDisplay="menu"
          menuItems={languageMenuItems}
          selectedMenuId={locale}
          onMenuSelect={(id) => setLocale(id as LocaleCode)}
          showDivider
          accessibilityLabel={t('profile.language')}
        />
        <EgItem
          testID="profile-row-font-size"
          mode={mode}
          icon={rowIcon}
          label={t('profile.fontSize')}
          value={t('profile.fontSizeDefault')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.fontSize')}
        />
        <EgItem
          testID="profile-row-currency-unit"
          mode={mode}
          icon={rowIcon}
          label={t('profile.currencyUnit')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.currencyUnit')}
        />
        <EgItem
          testID="profile-row-timezone"
          mode={mode}
          icon={rowIcon}
          label={t('profile.timezone')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.timezone')}
        />
        <EgItem
          testID="profile-row-mpc-network"
          mode={mode}
          icon={rowIcon}
          label={t('profile.mpcNetworkSettings')}
          showChevron
          onPress={() => undefined}
          showDivider={false}
          accessibilityLabel={t('profile.mpcNetworkSettings')}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionSecurity')}>
        <EgItem
          testID="profile-row-identity"
          mode={mode}
          icon={rowIcon}
          label={t('profile.identityVerification')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.identityVerification')}
        />
        <EgItem
          testID="profile-row-pin"
          mode={mode}
          icon={rowIcon}
          label={t('profile.pinCode')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.pinCode')}
        />
        <EgItem
          testID="profile-row-email"
          mode={mode}
          icon={rowIcon}
          label={t('profile.email')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.email')}
        />
        <EgItem
          testID="profile-row-google-auth"
          mode={mode}
          icon={rowIcon}
          label={t('profile.googleAuthenticator')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.googleAuthenticator')}
        />
        <EgItem
          testID="profile-row-transaction-password"
          mode={mode}
          icon={rowIcon}
          label={t('profile.transactionPassword')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.transactionPassword')}
        />
        <EgItem
          testID="profile-row-device"
          mode={mode}
          icon={rowIcon}
          label={t('profile.device')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.device')}
        />
        <EgItem
          testID="profile-row-biometric"
          mode={mode}
          icon={rowIcon}
          label={t('profile.biometric')}
          showChevron
          onPress={() => undefined}
          showDivider={false}
          accessibilityLabel={t('profile.biometric')}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionCregis')}>
        <EgItem
          testID="profile-row-customer-support"
          mode={mode}
          icon={rowIcon}
          label={t('profile.customerSupport')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.customerSupport')}
        />
        <EgItem
          testID="profile-row-about"
          mode={mode}
          icon={rowIcon}
          label={t('profile.about')}
          showChevron
          onPress={() => undefined}
          showDivider={false}
          accessibilityLabel={t('profile.about')}
        />
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}