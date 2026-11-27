import { StyleSheet, View } from 'react-native';
import { EgButtonGlass } from '@/eds/button-glass';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

const glassIconDefaults = {
  kind: 'icon' as const,
  iconCount: 1 as const,
  size: 'md' as const,
};

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
  const { t } = useTranslation();
  const { mode } = useEdsTheme();

  return (
    <EgButtonGlass
      {...glassIconDefaults}
      icon="eds-notice"
      mode={mode}
      accessibilityLabel={t('home.notifications')}
      testID="wallet-nav-notice"
    />
  );
}

export function WalletNavLeading() {
  return <WalletNavServicesGlass />;
}

export function WalletNavTrailing() {
  const { spacing } = useEdsTheme();

  return (
    <View style={[styles.trailing, { gap: edsPx(spacing['spacing-2-5']) }]}>
      <WalletNavNoticeGlass />
    </View>
  );
}

const styles = StyleSheet.create({
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});