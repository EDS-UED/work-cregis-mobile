import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import {
  EgDivider,
  EgIconBill,
  EgIconDatabaseSafety,
  EgIconEarphone,
  EgIconEditor,
  EgIconEye,
  EgIconFloderFavorite,
  EgIconGlobalPayments,
  EgIconInformation,
  EgIconUserSecurity,
} from '@/eds/profile-icons';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useAppStore } from '@/store';
import type { LocaleCode, ThemePreference } from '@/types/app';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { PersonalCenterSettingsRow } from '@/scenes/profile/PersonalCenterSettingsRow';
import { edsPx } from '@/utils/edsTheme';

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
  const { mode, spacing } = useEdsTheme();
  const locale = useAppStore((state) => state.locale);
  const themePreference = useAppStore((state) => state.themePreference);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const buildSuffix =
    Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode;
  const versionLabel =
    buildSuffix != null && buildSuffix !== ''
      ? `${appVersion}(${buildSuffix})`
      : appVersion;

  const pageDividerStyle = useMemo(
    () => ({ marginVertical: edsPx(spacing['spacing-2']) }),
    [spacing],
  );

  const iconProps = { mode, size: 'md' as const };

  return (
    <SceneScaffold title={t('profile.title')} showNavBack>
      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionAccount')}>
        <PersonalCenterSettingsRow
          testID="profile-row-account-security"
          icon={<EgIconUserSecurity {...iconProps} accessibilityLabel="" />}
          label={t('profile.accountSecurity')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-data-privacy"
          icon={<EgIconDatabaseSafety {...iconProps} accessibilityLabel="" />}
          label={t('profile.dataPrivacy')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionApp')}>
        <PersonalCenterSettingsRow
          testID="profile-row-language"
          icon={<EgIconGlobalPayments {...iconProps} accessibilityLabel="" />}
          label={t('profile.language')}
          value={t(LOCALE_LABEL_KEY[locale])}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-appearance"
          icon={<EgIconEye {...iconProps} accessibilityLabel="" />}
          label={t('profile.appearance')}
          value={t(THEME_LABEL_KEY[themePreference])}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-font-size"
          icon={<EgIconEditor {...iconProps} accessibilityLabel="" />}
          label={t('profile.fontSize')}
          value={t('profile.fontSizeDefault')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-personalization"
          icon={<EgIconFloderFavorite {...iconProps} accessibilityLabel="" />}
          label={t('profile.personalization')}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-voice"
          icon={<EgIconEarphone {...iconProps} accessibilityLabel="" />}
          label={t('profile.voice')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>

      <View style={pageDividerStyle}>
        <EgDivider variant="page" mode={mode} />
      </View>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionAbout')}>
        <PersonalCenterSettingsRow
          testID="profile-row-check-updates"
          icon={<EgIconInformation {...iconProps} accessibilityLabel="" />}
          label={t('profile.checkUpdates')}
          value={versionLabel}
          showChevron={false}
          onPress={() => undefined}
        />
        <PersonalCenterSettingsRow
          testID="profile-row-service-agreement"
          icon={<EgIconBill {...iconProps} accessibilityLabel="" />}
          label={t('profile.serviceAgreement')}
          onPress={() => undefined}
          isLast
        />
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}
