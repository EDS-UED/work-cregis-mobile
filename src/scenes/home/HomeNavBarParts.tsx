import { Pressable, StyleSheet, View } from 'react-native';
import {
  EgAvatar,
  EgButtonGlass,
  EgSymbol,
} from '@eds-evergreen/mobile';
import { useTranslation } from 'react-i18next';

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

export function HomeCompanyName() {
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <SceneText variant="bodySemibold" numberOfLines={1}>
      {companyName}
    </SceneText>
  );
}

/** 右栏 — 左 `eds-more-with-basis`，右用户头像（单胶囊 / 单 `EgButtonGlass`）。 */
export function HomeNavMoreUserGlass() {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const userDisplayName = useHomeStore((state) => state.userDisplayName);

  return (
    <EgButtonGlass
      kind="icon"
      size="md"
      variant="clear"
      iconCount={2}
      icon="eds-more-with-basis"
      avatarSlot={<HomeUserAvatar />}
      mode={mode}
      onPress={() => undefined}
      accessibilityLabel={`${t('home.more')}, ${t('home.userAvatar', { name: userDisplayName })}`}
      testID="home-nav-more-user-glass"
    />
  );
}

/** iOS 26+ 系统栏 — more + 头像；勿用 `EgButtonGlassNav*`（会叠 RN inset，与 §2.4 系统 ~4pt 重复）。 */
export function HomeNavBarMoreUserItem() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const userDisplayName = useHomeStore((state) => state.userDisplayName);
  const moreIconInsetLeft = edsPx(spacing['spacing-3']);
  const moreIconInsetRight = edsPx(spacing['spacing-4']);

  return (
    <Pressable
      onPress={() => undefined}
      accessibilityRole="button"
      accessibilityLabel={`${t('home.more')}, ${t('home.userAvatar', { name: userDisplayName })}`}
      testID="home-nav-more-user"
    >
      <View style={styles.navIconRow}>
        <EgSymbol
          name="eds-more-with-basis"
          size="md"
          mode={mode}
          fillTone="primary"
          style={{
            marginLeft: moreIconInsetLeft,
            marginRight: moreIconInsetRight,
          }}
        />
        <HomeUserAvatar />
      </View>
    </Pressable>
  );
}

/** iOS 26+ 系统栏 — 公司头像（系统玻璃胶囊）。 */
export function HomeNavBarCompanyItem() {
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <Pressable
      onPress={() => undefined}
      accessibilityRole="button"
      accessibilityLabel={companyName}
      testID="home-nav-company"
    >
      <HomeCompanyAvatar />
    </Pressable>
  );
}

/** Android / iOS ≤25 — RN `EgNavBar` 内容行。 */
export function HomeNavLeading() {
  const { mode, spacing } = useEdsTheme();
  const companyName = useHomeStore((state) => state.companyName);

  return (
    <View style={[styles.leading, { gap: edsPx(spacing['spacing-2']) }]}>
      <EgButtonGlass
        kind="icon"
        size="md"
        variant="clear"
        iconCount={1}
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
      <HomeNavMoreUserGlass />
    </View>
  );
}

const styles = StyleSheet.create({
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  navIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
