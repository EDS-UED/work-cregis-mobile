import { StyleSheet, View } from 'react-native';
import { EgButtonGlass } from '@/eds/button-glass';
import { useTranslation } from 'react-i18next';

import { NavNoticeGlassButton } from '@/scenes/shared/NavNoticeGlassButton';
import { useEdsTheme } from '@/hooks/useEdsTheme';

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

/** 钱包顶栏通知 · Mock 未读（与首页胶囊位置共用 `NavNoticeGlassButton`）。 */
const WALLET_NAV_NOTICE_BADGE = '18';

export function WalletNavServicesGlass() {
  const { mode } = useEdsTheme();
  const { t } = useTranslation();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      mode={mode}
      icon="eds-grid-layout"
      accessibilityLabel={t('scenes.walletServices')}
      testID="wallet-nav-services"
    />
  );
}

export function WalletNavNoticeGlass() {
  return (
    <NavNoticeGlassButton
      badgeLabel={WALLET_NAV_NOTICE_BADGE}
      glassTestID="wallet-nav-notice"
      messageTestID="wallet-nav-notice-message"
    />
  );
}

/** iOS 26+ 系统栏 — `eds-notice`（与 `HomeNavNoticeGlassNav` 同款徽章定位）。 */
export function WalletNavNoticeGlassNav() {
  return <WalletNavNoticeGlass />;
}

export function WalletNavLeading() {
  return <WalletNavServicesGlass />;
}

export function WalletNavTrailing() {
  return (
    <View style={styles.trailing}>
      <View style={styles.trailingCapsules}>
        <WalletNavNoticeGlass />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    overflow: 'visible',
  },
  trailingCapsules: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
});