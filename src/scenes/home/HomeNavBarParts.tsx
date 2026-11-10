import { StyleSheet, View } from 'react-native';
import { EgAvatar, EgButtonGlass } from '@/eds/button-glass';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import type { HomeStackParamList } from '@/navigation/types';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

import companyAvatar from '../../../assets/company-avatar.png';

function HomeCompanyAvatar() {
  const companyName = useHomeStore((state) => state.companyName);
  return (
    <EgAvatar
      name={companyName}
      source={companyAvatar}
      size="lg"
      accessibilityLabel={companyName}
    />
  );
}

function HomeUserAvatar() {
  const userDisplayName = useHomeStore((state) => state.userDisplayName);
  const userAvatarColorIndex = useHomeStore((state) => state.userAvatarColorIndex);

  return (
    <EgAvatar
      name={userDisplayName}
      size="lg"
      colorIndex={userAvatarColorIndex}
      accessibilityLabel={userDisplayName}
    />
  );
}

/** 顶栏公司名 — 最大 104pt，超出单行尾部省略。 */
const HOME_COMPANY_NAME_MAX_WIDTH = 104;

function HomeCompanyName() {
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <View style={styles.companyNameWrap}>
      <SceneText
        variant="bodySemibold"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.companyNameText}
      >
        {companyName}
      </SceneText>
    </View>
  );
}

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

/** iOS 26+ 系统栏 — `EgButtonGlass`（`iconCount={1}`）。 */
export function HomeNavCompanyGlassNav() {
  const { mode } = useEdsTheme();
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      mode={mode}
      avatarSlot={<HomeCompanyAvatar />}
      onPress={() => undefined}
      accessibilityLabel={companyName}
      testID="home-nav-company-glass"
    />
  );
}

export function HomeNavCompanyNameNav() {
  return <HomeCompanyName />;
}

/** iOS 26+ 系统栏 — `eds-scan-code`。 */
export function HomeNavScanGlassNav() {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      icon="eds-scan-code"
      mode={mode}
      onPress={() => undefined}
      accessibilityLabel={t('home.scan')}
      testID="home-nav-scan-glass"
    />
  );
}

/** iOS 26+ 系统栏 — `eds-notice`。 */
export function HomeNavNoticeGlassNav() {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      icon="eds-notice"
      mode={mode}
      onPress={() => undefined}
      accessibilityLabel={t('home.notifications')}
      testID="home-nav-notice-glass"
    />
  );
}

/** iOS 26+ 系统栏 — 用户头像。 */
export function HomeNavUserGlassNav() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { mode } = useEdsTheme();
  const userDisplayName = useHomeStore((state) => state.userDisplayName);

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      mode={mode}
      avatarSlot={<HomeUserAvatar />}
      onPress={() => navigation.navigate('PersonalCenter')}
      accessibilityLabel={t('home.userAvatar', { name: userDisplayName })}
      testID="home-nav-user-glass"
    />
  );
}

/** Overlay 顶栏右栏 — 三颗 `EgButtonGlass`（扫码、通知、个人），间距 `spacing-2-5`（10px）。 */
function HomeNavTrailingGlass() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { mode, spacing } = useEdsTheme();
  const userDisplayName = useHomeStore((state) => state.userDisplayName);
  const gap = edsPx(spacing['spacing-2-5']);

  return (
    <View style={[styles.trailingCapsules, { gap }]}>
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-scan-code"
        mode={mode}
        onPress={() => undefined}
        accessibilityLabel={t('home.scan')}
        testID="home-nav-scan-glass"
      />
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-notice"
        mode={mode}
        onPress={() => undefined}
        accessibilityLabel={t('home.notifications')}
        testID="home-nav-notice-glass"
      />
      <EgButtonGlass
        {...glassIconDefaults}
        mode={mode}
        avatarSlot={<HomeUserAvatar />}
        onPress={() => navigation.navigate('PersonalCenter')}
        accessibilityLabel={t('home.userAvatar', { name: userDisplayName })}
        testID="home-nav-user-glass"
      />
    </View>
  );
}

/** 顶栏左栏 — 公司 `EgButtonGlass`（`iconCount={1}` 头像槽）+ 公司名（`spacing-2`）。 */
export function HomeNavLeading() {
  const { mode, spacing } = useEdsTheme();
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <View style={[styles.leading, { gap: edsPx(spacing['spacing-2']) }]}>
      <EgButtonGlass
        {...glassIconDefaults}
        mode={mode}
        accessibilityLabel={companyName}
        onPress={() => undefined}
        testID="home-nav-company-glass"
        avatarSlot={<HomeCompanyAvatar />}
      />
      <HomeCompanyName />
    </View>
  );
}

export function HomeNavTrailing() {
  return (
    <View style={styles.trailing}>
      <HomeNavTrailingGlass />
    </View>
  );
}

const styles = StyleSheet.create({
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  leadingEmbedded: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  companyNameWrap: {
    maxWidth: HOME_COMPANY_NAME_MAX_WIDTH,
    flexShrink: 1,
    minWidth: 0,
  },
  companyNameText: {
    flexShrink: 1,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  trailingCapsules: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCompanyName: {
    maxWidth: HOME_COMPANY_NAME_MAX_WIDTH,
    flexShrink: 1,
  },
});
