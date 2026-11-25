import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgDecorButton, EgOptionButton } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';

/** 订阅顶区 ·「升级」+「续费」· 与早期 `TeamCenterPlanCardContent` 一致。 */
export function TeamPlanSubscriptionActions() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          gap: edsPx(spacing['spacing-2-5']),
        },
      }),
    [spacing],
  );

  return (
    <View style={styles.row}>
      <EgDecorButton
        testID="subscription-plan-upgrade"
        label={t('team.upgrade')}
        mode={mode}
        size="sm"
        onPress={() => undefined}
        accessibilityLabel={t('team.upgrade')}
      />
      <EgOptionButton
        testID="subscription-plan-renew"
        label={t('team.renewFee')}
        mode={mode}
        size="sm"
        onPress={() => undefined}
        accessibilityLabel={t('team.renewFee')}
      />
    </View>
  );
}