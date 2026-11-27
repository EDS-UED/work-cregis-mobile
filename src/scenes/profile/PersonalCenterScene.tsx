import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { EgDataListRowPressable } from '@/eds/data-list';
import { EgLink } from '@/eds/link-button';
import { EgDivider, EgSymbol } from '@/eds/profile-icons';
import { EgSystemTag } from '@/eds/home-ui';
import type { EgMenuItem } from '@/eds/menu';
import {
  EgItem,
  EG_ITEM_ICON_GAP,
  EG_ITEM_ICON_SLOT,
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  EG_ITEM_TAP_RADIUS,
  getEgItemDividerInset,
} from '@/eds/item';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';
import { useAppStore, useHomeStore } from '@/store';
import type { CurrencyUnit, LocaleCode, ThemePreference } from '@/types/app';
import { PersonalCenterAccountProfileRow } from '@/scenes/profile/PersonalCenterAccountProfileRow';
import { PersonalCenterSettingsGroup } from '@/scenes/profile/PersonalCenterSettingsGroup';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const LOCALE_LABEL_KEY: Record<LocaleCode, `profile.${string}`> = {
  'zh-CN': 'profile.localeValueZhCN',
  'en-US': 'profile.localeValueEnUS',
  'zh-TW': 'profile.localeValueZhTW',
};

const CURRENCY_LABEL_KEY: Record<CurrencyUnit, `profile.${string}`> = {
  CNY: 'profile.currencyValueCny',
  USD: 'profile.currencyValueUsd',
  HKD: 'profile.currencyValueHkd',
};

const THEME_LABEL_KEY: Record<ThemePreference, `profile.${string}`> = {
  system: 'profile.themeValueSystem',
  light: 'profile.themeValueLight',
  dark: 'profile.themeValueDark',
};

type StatusRowProps = {
  testID: string;
  label: string;
  icon: ReactNode;
  tag: ReactNode;
  /** 箭头左侧附加操作，例如「重置」。 */
  trailing?: ReactNode;
  showDivider?: boolean;
  onPress: () => void;
};

/** 状态标签贴在标题后 `spacing-1`（4px），箭头仍在行尾。EgItem 没有标题旁插槽。 */
function PersonalCenterStatusRow({
  testID,
  label,
  icon,
  tag,
  trailing,
  showDivider = true,
  onPress,
}: StatusRowProps) {
  const { mode, spacing, colors } = useEdsTheme();
  const tagGap = edsPx(spacing['spacing-1']);
  const tapBackground = String(colors['event-tap']);
  const dividerInset = getEgItemDividerInset(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          width: '100%',
          minHeight: EG_ITEM_MIN_HEIGHT,
          paddingHorizontal: EG_ITEM_PAD_H,
          paddingVertical: EG_ITEM_PAD_V,
          borderRadius: EG_ITEM_TAP_RADIUS,
          borderCurve: 'continuous',
        },
        iconSlot: {
          width: EG_ITEM_ICON_SLOT,
          marginRight: EG_ITEM_ICON_GAP,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelRow: {
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          alignItems: 'center',
        },
        label: {
          flexShrink: 1,
        },
        tag: {
          marginLeft: tagGap,
          flexShrink: 0,
        },
        trailing: {
          flexShrink: 0,
          marginLeft: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          gap: edsPx(spacing['spacing-2']),
        },
        dividerWrap: {
          alignSelf: 'stretch',
          paddingLeft: dividerInset,
          paddingRight: EG_ITEM_PAD_H,
        },
      }),
    [dividerInset, spacing, tagGap],
  );

  return (
    <>
      <EgDataListRowPressable
        testID={testID}
        accessibilityLabel={label}
        onPress={onPress}
        pressIntensity="xs"
        style={({ pressed }) =>
          StyleSheet.flatten([styles.row, pressed ? { backgroundColor: tapBackground } : null])
        }
      >
        <View style={styles.iconSlot}>{icon}</View>
        <View style={styles.labelRow}>
          <SceneText variant="body" numberOfLines={1} style={styles.label}>
            {label}
          </SceneText>
          <View style={styles.tag}>{tag}</View>
        </View>
        <View style={styles.trailing}>
          {trailing}
          <EgSymbol
            name="eds-arrow-right-mini-ios"
            mode={mode}
            size="sm"
            strokeColorToken="text-base-secondary"
            accessibilityLabel=""
          />
        </View>
      </EgDataListRowPressable>
      {showDivider ? (
        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} orientation="horizontal" />
        </View>
      ) : null}
    </>
  );
}

/** 个人中心 — 分组设置列表；栈动效见 `usePersonalCenterScreenOptions`。 */
export function PersonalCenterScene() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const navigation = useHomeStackNavigation();
  const locale = useAppStore((state) => state.locale);
  const themePreference = useAppStore((state) => state.themePreference);
  const setLocale = useAppStore((state) => state.setLocale);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const currencyUnit = useAppStore((state) => state.currencyUnit);
  const setCurrencyUnit = useAppStore((state) => state.setCurrencyUnit);
  const transactionPasswordSet = useHomeStore((state) => state.transactionPasswordSet);

  const appearanceMenuItems = useMemo(
    (): EgMenuItem[] => [
      { id: 'system', label: t('profile.themeValueSystem') },
      { id: 'light', label: t('profile.themeValueLight') },
      { id: 'dark', label: t('profile.themeValueDark') },
    ],
    [t],
  );

  const currencyMenuItems = useMemo(
    (): EgMenuItem[] => [
      { id: 'CNY', label: t('profile.currencyValueCny') },
      { id: 'USD', label: t('profile.currencyValueUsd') },
      { id: 'HKD', label: t('profile.currencyValueHkd') },
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

  const statusTag = (set: boolean, unsetLabel = t('profile.statusUnverified')) => (
    <EgSystemTag
      mode={mode}
      size="sm"
      systemType="subtle"
      status={set ? 'success' : 'warning'}
      label={set ? t('profile.statusSet') : unsetLabel}
    />
  );

  return (
    <SceneScaffold title={t('profile.title')} showNavBack pageBackground="card">
      <PersonalCenterSettingsGroup>
        <PersonalCenterAccountProfileRow />
        <EgItem
          testID="profile-row-change-nickname"
          mode={mode}
          icon={rowIcon}
          label={t('profile.changeNickname')}
          showChevron
          onPress={() => navigation.navigate('ProfileEdit')}
          showDivider={false}
          accessibilityLabel={t('profile.changeNickname')}
        />
      </PersonalCenterSettingsGroup>

      <PersonalCenterSettingsGroup sectionTitle={t('profile.sectionSecurity')}>
        <PersonalCenterStatusRow
          testID="profile-row-identity"
          icon={rowIcon}
          label={t('profile.identityVerification')}
          tag={statusTag(false)}
          onPress={() => navigation.navigate('IdentityVerification')}
        />
        <PersonalCenterStatusRow
          testID="profile-row-email"
          icon={rowIcon}
          label={t('profile.email')}
          tag={statusTag(true)}
          onPress={() => navigation.navigate('AccountEmail')}
        />
        <PersonalCenterStatusRow
          testID="profile-row-google-auth"
          icon={rowIcon}
          label={t('profile.googleAuthenticator')}
          tag={statusTag(true)}
          trailing={
            <EgLink
              mode={mode}
              size="md"
              tone="decor"
              label={t('profile.googleAuthReset')}
              onPress={() => navigation.navigate('GoogleAuthenticator')}
            />
          }
          onPress={() => navigation.navigate('GoogleAuthenticator')}
        />
        {transactionPasswordSet ? (
          <EgItem
            testID="profile-row-transaction-password"
            mode={mode}
            icon={rowIcon}
            label={t('profile.transactionPassword')}
            trailingDisplay="custom"
            trailing={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-2']) }}>
                <EgLink
                  mode={mode}
                  size="md"
                  tone="decor"
                  label={t('profile.googleAuthReset')}
                  onPress={() => navigation.navigate('SetTransactionPassword')}
                />
                <EgSymbol
                  name="eds-arrow-right-mini-ios"
                  mode={mode}
                  size="sm"
                  strokeColorToken="text-base-secondary"
                  accessibilityLabel=""
                />
              </View>
            }
            showChevron={false}
            onPress={() => navigation.navigate('SetTransactionPassword')}
            showDivider
            accessibilityLabel={t('profile.transactionPassword')}
          />
        ) : (
          <PersonalCenterStatusRow
            testID="profile-row-transaction-password"
            icon={rowIcon}
            label={t('profile.transactionPassword')}
            tag={statusTag(false, t('profile.statusUnset'))}
            onPress={() => navigation.navigate('SetTransactionPassword')}
          />
        )}
        <EgItem
          testID="profile-row-passkey"
          mode={mode}
          icon={rowIcon}
          label={t('profile.passkey')}
          showChevron
          onPress={() => undefined}
          showDivider
          accessibilityLabel={t('profile.passkey')}
        />
        <EgItem
          testID="profile-row-device"
          mode={mode}
          icon={rowIcon}
          label={t('profile.device')}
          showChevron
          onPress={() => navigation.navigate('LoginDevices')}
          showDivider={false}
          accessibilityLabel={t('profile.device')}
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
          testID="profile-row-currency-unit"
          mode={mode}
          icon={rowIcon}
          label={t('profile.currencyUnit')}
          value={t(CURRENCY_LABEL_KEY[currencyUnit])}
          trailingDisplay="menu"
          menuItems={currencyMenuItems}
          selectedMenuId={currencyUnit}
          onMenuSelect={(id) => setCurrencyUnit(id as CurrencyUnit)}
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
          onPress={() => navigation.navigate('MpcNetworkSettings')}
          showDivider={false}
          accessibilityLabel={t('profile.mpcNetworkSettings')}
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
          onPress={() => navigation.navigate('About')}
          showDivider={false}
          accessibilityLabel={t('profile.about')}
        />
      </PersonalCenterSettingsGroup>
    </SceneScaffold>
  );
}