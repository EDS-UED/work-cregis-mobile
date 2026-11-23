import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgItem, EgItemGroup } from '@/eds/item';
import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterMenuLeadIcon } from '@/scenes/team/TeamCenterMenuLeadIcon';
import { TeamSubscriptionSection } from '@/scenes/team/TeamSubscriptionSection';
import { TeamSubscriptionSupportBanner } from '@/scenes/team/TeamSubscriptionSupportBanner';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

const MOCK_OVERVIEW_BALANCE = '$ 4,910.37';
const MOCK_WALLET_ADDRESS_COUNT = 99;
const MOCK_SINGLE_SIG_USED = 1;
const MOCK_SINGLE_SIG_MAX = 5;
const MOCK_MULTI_SIG_USED = 2;
const MOCK_MULTI_SIG_MAX = 5;

const FINANCE_ROW_ICONS = {
  overview: 'eds-pentagram',
  feeRecords: 'eds-pentagram',
  gasRecords: 'eds-pentagram',
  autoRenew: 'eds-pentagram',
  orders: 'eds-pentagram',
} as const;

const WALLET_ROW_ICONS = {
  addresses: 'eds-address-books',
  singleSig: 'eds-pentagram',
  multiSig: 'eds-asafety',
} as const;

type SubscriptionQuotaItemProps = {
  icon: string;
  label: string;
  used: number;
  max: number;
  onExpand?: () => void;
  showDivider?: boolean;
};

function SubscriptionQuotaEgItem({
  icon,
  label,
  used,
  max,
  onExpand,
  showDivider = true,
}: SubscriptionQuotaItemProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  return (
    <EgItem
      mode={mode}
      icon={<TeamCenterMenuLeadIcon icon={icon} />}
      label={label}
      trailingDisplay="custom"
      showChevron={false}
      showDivider={showDivider}
      trailing={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-2']),
            flexShrink: 0,
          }}
        >
          <SceneText variant="bodySmallSecondary">
            {used} / {max}
          </SceneText>
          <EgLink
            mode={mode}
            size="sm"
            tone="brand"
            label={t('team.subscriptionExpandQuota')}
            onPress={onExpand}
            accessibilityLabel={t('team.subscriptionExpandQuota')}
          />
        </View>
      }
      onPress={onExpand}
      accessibilityLabel={label}
    />
  );
}

/** 订阅 page-shot · 展开后段正文（Hero 由 `TeamPlanPageShotHero` 承担）。 */
export function TeamSubscriptionPageShotContent() {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stack: {
          gap: edsPx(spacing['spacing-6']),
        },
      }),
    [spacing],
  );

  return (
    <View>
      <View style={styles.stack}>
        <TeamSubscriptionSection title={t('team.sectionAccountFinance')}>
          <EgItemGroup mode={mode}>
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={FINANCE_ROW_ICONS.overview} />}
              label={t('team.subscriptionOverview')}
              value={MOCK_OVERVIEW_BALANCE}
              showChevron
              onPress={() => undefined}
              accessibilityLabel={t('team.subscriptionOverview')}
            />
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={FINANCE_ROW_ICONS.feeRecords} />}
              label={t('team.feeRecords')}
              showChevron
              onPress={() => undefined}
              accessibilityLabel={t('team.feeRecords')}
            />
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={FINANCE_ROW_ICONS.gasRecords} />}
              label={t('team.gasPaymentRecords')}
              showChevron
              onPress={() => undefined}
              accessibilityLabel={t('team.gasPaymentRecords')}
            />
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={FINANCE_ROW_ICONS.autoRenew} />}
              label={t('team.subscriptionAutoRenewManagement')}
              value={t('team.subscriptionAutoRenewTagline')}
              showChevron
              onPress={() => undefined}
              accessibilityLabel={t('team.subscriptionAutoRenewManagement')}
            />
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={FINANCE_ROW_ICONS.orders} />}
              label={t('team.orders')}
              value={t('team.subscriptionOrdersEmpty')}
              showChevron
              showDivider={false}
              onPress={() => undefined}
              accessibilityLabel={t('team.orders')}
            />
          </EgItemGroup>
        </TeamSubscriptionSection>

        <TeamSubscriptionSection
          title={t('team.sectionWalletQuota')}
          trailing={{
            label: t('team.subscriptionEnterpriseMultisig'),
            onPress: () => undefined,
          }}
        >
          <EgItemGroup mode={mode}>
            <EgItem
              mode={mode}
              icon={<TeamCenterMenuLeadIcon icon={WALLET_ROW_ICONS.addresses} />}
              label={t('team.subscriptionWalletAddresses')}
              value={t('team.subscriptionWalletAddressCount', {
                count: MOCK_WALLET_ADDRESS_COUNT,
              })}
              showChevron
              onPress={() => undefined}
              accessibilityLabel={t('team.subscriptionWalletAddresses')}
            />
            <SubscriptionQuotaEgItem
              icon={WALLET_ROW_ICONS.singleSig}
              label={t('team.subscriptionSingleSigQuota')}
              used={MOCK_SINGLE_SIG_USED}
              max={MOCK_SINGLE_SIG_MAX}
              onExpand={() => undefined}
            />
            <SubscriptionQuotaEgItem
              icon={WALLET_ROW_ICONS.multiSig}
              label={t('team.subscriptionMultiSigQuota')}
              used={MOCK_MULTI_SIG_USED}
              max={MOCK_MULTI_SIG_MAX}
              onExpand={() => undefined}
              showDivider={false}
            />
          </EgItemGroup>
        </TeamSubscriptionSection>

        <View style={{ paddingHorizontal: sceneInset }}>
          <TeamSubscriptionSupportBanner />
        </View>
      </View>
    </View>
  );
}