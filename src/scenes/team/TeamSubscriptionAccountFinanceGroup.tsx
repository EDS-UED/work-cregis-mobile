import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EgItemGroup } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionDisclosureRow } from '@/scenes/team/TeamSubscriptionDisclosureRow';
import { TEAM_SUBSCRIPTION_ITEM_ICONS } from '@/scenes/team/teamSubscriptionItemIcons';
import { teamSubscriptionEgItemGroupScreenStyle } from '@/scenes/team/teamSubscriptionItemLayout';
import { useHomeStore } from '@/store';

type TeamSubscriptionAccountFinanceGroupProps = {
  onPressOverview?: () => void;
  onPressFeeRecords?: () => void;
  onPressGasRecords?: () => void;
  onPressAutoRenew?: () => void;
  onPressOrders?: () => void;
};

/** 分割线以下 · `EgItemGroup` · 主｜附加说明。 */
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
        iconName={TEAM_SUBSCRIPTION_ITEM_ICONS.overview}
        label={t('team.subscriptionOverview')}
        value={teamAccountBalance}
        onPress={onPressOverview ?? (() => undefined)}
        accessibilityLabel={t('team.subscriptionOverview')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-fee-records"
        iconName={TEAM_SUBSCRIPTION_ITEM_ICONS.feeRecords}
        label={t('team.feeRecords')}
        onPress={onPressFeeRecords ?? (() => undefined)}
        accessibilityLabel={t('team.feeRecords')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-gas-records"
        iconName={TEAM_SUBSCRIPTION_ITEM_ICONS.gasRecords}
        label={t('team.gasPaymentRecords')}
        onPress={onPressGasRecords ?? (() => undefined)}
        accessibilityLabel={t('team.gasPaymentRecords')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-auto-renew"
        iconName={TEAM_SUBSCRIPTION_ITEM_ICONS.autoRenew}
        label={t('team.subscriptionAutoRenewManagement')}
        onPress={onPressAutoRenew ?? (() => undefined)}
        accessibilityLabel={t('team.subscriptionAutoRenewManagement')}
      />
      <TeamSubscriptionDisclosureRow
        testID="subscription-orders"
        iconName={TEAM_SUBSCRIPTION_ITEM_ICONS.orders}
        label={t('team.orderManagement')}
        onPress={onPressOrders ?? (() => undefined)}
        accessibilityLabel={t('team.orderManagement')}
      />
    </EgItemGroup>
  );
}