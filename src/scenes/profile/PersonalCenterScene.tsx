import { useMemo } from 'react';
import type { EgMenuItem } from '@/eds/menu';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/store';
import type { LocaleCode, ThemePreference } from '@/types/app';
import { PersonalCenterAccountProfileRow } from '@/scenes/profile/PersonalCenterAccountProfileRow';
import { PERSONAL_CENTER_ITEM_ICONS } from '@/scenes/profile/personalCenterItemIcons';
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

  return (
    <SceneScaffold title={t('profile.title')} showNavBack pageBackground="card">
      <PersonalCenterSettingsGroup>
        <PersonalCenterAccountProfileRow />
        <PersonalCenterSettingsRow
          testID="profile-row-change-nickname"
          iconName={PERSONAL_CENTER_ITEM_ICONS.changeNickname}
          label={t('profile.changeNickname')}
          showDivider={false}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionSecurity')}>
        <PersonalCenterSettingsRow
          testID="profile-row-identity"
          iconName={PERSONAL_CENTER_ITEM_ICONS.identity}
          label={t('profile.identityVerification')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-email"
          iconName={PERSONAL_CENTER_ITEM_ICONS.email}
          label={t('profile.email')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-google-auth"
          iconName={PERSONAL_CENTER_ITEM_ICONS.googleAuth}
          label={t('profile.googleAuthenticator')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-transaction-password"
          iconName={PERSONAL_CENTER_ITEM_ICONS.transactionPassword}
          label={t('profile.transactionPassword')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-device"
          iconName={PERSONAL_CENTER_ITEM_ICONS.device}
          label={t('profile.device')}
          showDivider={false}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionPreferences')}>
        <PersonalCenterSettingsRow
          testID="profile-row-appearance"
          iconName={PERSONAL_CENTER_ITEM_ICONS.appearance}
          label={t('profile.appearance')}
          value={t(THEME_LABEL_KEY[themePreference])}
          trailingDisplay="menu"
          menuItems={appearanceMenuItems}
          selectedMenuId={themePreference}
          onMenuSelect={(id) => setThemePreference(id as ThemePreference)}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-language"
          iconName={PERSONAL_CENTER_ITEM_ICONS.language}
          label={t('profile.language')}
          value={t(LOCALE_LABEL_KEY[locale])}
          trailingDisplay="menu"
          menuItems={languageMenuItems}
          selectedMenuId={locale}
          onMenuSelect={(id) => setLocale(id as LocaleCode)}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-currency-unit"
          iconName={PERSONAL_CENTER_ITEM_ICONS.currencyUnit}
          label={t('profile.currencyUnit')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-timezone"
          iconName={PERSONAL_CENTER_ITEM_ICONS.timezone}
          label={t('profile.timezone')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-mpc-network"
          iconName={PERSONAL_CENTER_ITEM_ICONS.mpcNetwork}
          label={t('profile.mpcNetworkSettings')}
          showDivider={false}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionCregis')}>
        <PersonalCenterSettingsRow
          testID="profile-row-customer-support"
          iconName={PERSONAL_CENTER_ITEM_ICONS.customerSupport}
          label={t('profile.customerSupport')}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-about"
          iconName={PERSONAL_CENTER_ITEM_ICONS.about}
          label={t('profile.about')}
          showDivider={false}
        />
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}