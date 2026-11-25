import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EgItemGroup } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionDisclosureRow } from '@/scenes/team/TeamSubscriptionDisclosureRow';
import { teamSubscriptionEgItemGroupScreenStyle } from '@/scenes/team/teamSubscriptionItemLayout';
import { useHomeStore } from '@/store';

type TeamSubscriptionAccountFinanceGroupProps = {
  onPressOverview?: () => void;
  onPressFeeRecords?: () => void;
  onPressGasRecords?: () => void;
  onPressAutoRenew?: () => void;
  onPressOrders?: () => void;
};

/** 订阅 · 账户与财务 · `EgItemGroup` + `EgItem` 披露行。 */
export function TeamSubscriptionAccountFinanceGroup({
  onPressOverview,
  onPressFeeRecords,
  onPressGasRecords,
  onPressAutoRenew,
  onPressOrders,
}: TeamSubscriptionAccountFinanceGroupProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const teamAccountBalance = useHomeStore((state) => state.teamAccountBalance);

  const groupStyle = useMemo(
    () => teamSubscriptionEgItemGroupScreenStyle(spacing),
    [spacing],
  );

  return (
    <EgItemGroup mode={mode} testID="subscription-account-finance" style={groupStyle}>
      <TeamSubscriptionDisclosureRow
        testID="subscription-account-overview"
        label={t('team.subscriptionOverview')}
        value={teamAccountBalance}
        onPress={onPressOverview ?? (() => undefined)}
        accessibilityLabel={t('team.subscriptionOverview')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-fee-records"
        label={t('team.feeRecords')}
        onPress={onPressFeeRecords ?? (() => undefined)}
        accessibilityLabel={t('team.feeRecords')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-gas-records"
        label={t('team.gasPaymentRecords')}
        onPress={onPressGasRecords ?? (() => undefined)}
        accessibilityLabel={t('team.gasPaymentRecords')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-auto-renew"
        label={t('team.subscriptionAutoRenewManagement')}
        onPress={onPressAutoRenew ?? (() => undefined)}
        accessibilityLabel={t('team.subscriptionAutoRenewManagement')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-orders"
        label={t('team.orders')}
        onPress={onPressOrders ?? (() => undefined)}
        accessibilityLabel={t('team.orders')}
      />
    </EgItemGroup>
  );
}