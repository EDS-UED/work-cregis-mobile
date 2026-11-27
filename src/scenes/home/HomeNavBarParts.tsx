import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { EgAvatar, EgButtonGlass } from '@/eds/button-glass';
import { EgMessage } from '@/eds/feedback';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { formatNotificationCountBadge } from '@/scenes/messages/messagesFormat';
import {
  MESSAGE_MOCK_ITEMS,
  messageTotalUnreadCount,
} from '@/scenes/messages/messagesMock';
import { HomeScanPageShotTrigger } from '@/scenes/home/HomeScanPageShotTrigger';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';
import { SceneText } from '@/scenes/shared/SceneText';
import { useHomeStore } from '@/store';
import { edsPx } from '@/utils/edsTheme';

function useOpenTeamCenter() {
  const navigation = useHomeStackNavigation();
  return useCallback(() => {
    navigation.navigate('TeamCenter');
  }, [navigation]);
}

function useOpenMessages() {
  const navigation = useHomeStackNavigation();
  return useCallback(() => navigation.navigate('Messages'), [navigation]);
}

function useOpenPersonalCenter() {
  const navigation = useHomeStackNavigation();
  return useCallback(() => navigation.navigate('PersonalCenter'), [navigation]);
}

function HomeCompanyAvatar() {
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const activeTeamId = useHomeStore((state) => state.activeTeamId);
  const teams = useHomeStore((state) => state.teams);
  const activeTeam = teams.find((team) => team.id === activeTeamId);

  return (
    <EgAvatar
      name={activeTeam?.name ?? teamDisplayName}
      size="lg"
      source={activeTeam?.avatarSource}
      colorIndex={activeTeam?.colorIndex}
      accessibilityLabel={teamDisplayName}
    />
  );
}

/** 顶栏公司名 — 最大 104pt，超出单行尾部省略。 */
export const HOME_COMPANY_NAME_MAX_WIDTH = 104;

function HomeCompanyName() {
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);

  return (
    <View style={styles.companyNameWrap}>
      <SceneText
        variant="bodySemibold"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.companyNameText}
      >
        {teamDisplayName}
      </SceneText>
    </View>
  );
}

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

function useHomeNoticeBadgeLabel(): string | undefined {
  const total = useMemo(() => messageTotalUnreadCount(MESSAGE_MOCK_ITEMS), []);
  return formatNotificationCountBadge(total);
}

/** 通知玻璃钮 + 右上 `EgMessage`（未读合计）。 */
function HomeNavNoticeGlassButton() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const openMessages = useOpenMessages();
  const badgeLabel = useHomeNoticeBadgeLabel();
  const badgeOffset = edsPx(spacing['spacing-1']);

  return (
    <View style={styles.noticeCapsuleHost}>
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-notice"
        mode={mode}
        onPress={openMessages}
        accessibilityLabel={t('home.notifications')}
        testID="home-nav-notice-glass"
      />
      {badgeLabel ? (
        <View
          pointerEvents="none"
          style={[
            styles.noticeCapsuleBadge,
            { top: -badgeOffset, right: -badgeOffset - edsPx(spacing['spacing-1']) },
          ]}
        >
          <EgMessage
            mode={mode}
            tone="danger"
            label={badgeLabel}
            accessibilityLabel={t('messages.unreadBadge')}
            testID="home-nav-notice-message"
          />
        </View>
      ) : null}
    </View>
  );
}

/** iOS 26+ 系统栏 — `EgButtonGlass`（`iconCount={1}`）。 */
export function HomeNavCompanyGlassNav() {
  const { mode } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const openTeamCenter = useOpenTeamCenter();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      mode={mode}
      avatarSlot={<HomeCompanyAvatar />}
      onPress={openTeamCenter}
      accessibilityLabel={teamDisplayName}
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
    <HomeScanPageShotTrigger>
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-scan-code"
        mode={mode}
        accessibilityLabel={t('home.scan')}
        testID="home-nav-scan-glass"
      />
    </HomeScanPageShotTrigger>
  );
}

/** iOS 26+ 系统栏 — `eds-notice`。 */
export function HomeNavNoticeGlassNav() {
  return <HomeNavNoticeGlassButton />;
}

/** iOS 26+ 系统栏 — 个人设置 `eds-gear`。 */
export function HomeNavUserGlassNav() {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const openPersonalCenter = useOpenPersonalCenter();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      icon="eds-gear"
      mode={mode}
      onPress={openPersonalCenter}
      accessibilityLabel={t('profile.title')}
      testID="home-nav-user-glass"
    />
  );
}

/** Overlay 顶栏右栏 — 三颗 `EgButtonGlass`（扫码、通知、设置），间距 `spacing-2-5`（10px）。 */
function HomeNavTrailingGlass() {
  const { t } = useTranslation();
  const openPersonalCenter = useOpenPersonalCenter();
  const { mode, spacing } = useEdsTheme();
  const gap = edsPx(spacing['spacing-2-5']);

  return (
    <View style={[styles.trailingCapsules, { gap }]}>
      <HomeScanPageShotTrigger>
        <EgButtonGlass
          {...glassIconDefaults}
          icon="eds-scan-code"
          mode={mode}
          accessibilityLabel={t('home.scan')}
          testID="home-nav-scan-glass"
        />
      </HomeScanPageShotTrigger>
      <HomeNavNoticeGlassButton />
      <EgButtonGlass
        {...glassIconDefaults}
        icon="eds-gear"
        mode={mode}
        onPress={openPersonalCenter}
        accessibilityLabel={t('profile.title')}
        testID="home-nav-user-glass"
      />
    </View>
  );
}

/** 顶栏左栏 — 公司 `EgButtonGlass`（`iconCount={1}` 头像槽）+ 公司名（`spacing-2`）。 */
export function HomeNavLeading() {
  const { mode, spacing } = useEdsTheme();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);
  const openTeamCenter = useOpenTeamCenter();

  return (
    <View style={[styles.leading, { gap: edsPx(spacing['spacing-2']) }]}>
      <EgButtonGlass
        {...glassIconDefaults}
        mode={mode}
        accessibilityLabel={teamDisplayName}
        onPress={openTeamCenter}
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
  noticeCapsuleHost: {
    position: 'relative',
    overflow: 'visible',
  },
  noticeCapsuleBadge: {
    position: 'absolute',
    zIndex: 1,
  },
  headerCompanyName: {
    maxWidth: HOME_COMPANY_NAME_MAX_WIDTH,
    flexShrink: 1,
  },
});
