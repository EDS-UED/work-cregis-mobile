import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionBenefitsCard } from '@/scenes/team/TeamSubscriptionBenefitsCard';
import { TeamSubscriptionDisclosureRow } from '@/scenes/team/TeamSubscriptionDisclosureRow';
import { TeamSubscriptionSection } from '@/scenes/team/TeamSubscriptionSection';
import { TeamSubscriptionSupportBanner } from '@/scenes/team/TeamSubscriptionSupportBanner';
import { edsPx } from '@/utils/edsTheme';

const MOCK_OVERVIEW_BALANCE = '$ 4,910.37';
const MOCK_WALLET_ADDRESS_COUNT = 99;
const MOCK_SINGLE_SIG_USED = 1;
const MOCK_SINGLE_SIG_MAX = 5;
const MOCK_MULTI_SIG_USED = 2;
const MOCK_MULTI_SIG_MAX = 5;

/** 订阅 page-shot 正文（Hero 在 `TeamPlanPageShotHero`）· 边距与 `gap` 由根 `body` 承担。 */
export const TeamSubscriptionPageShotContent = memo(function TeamSubscriptionPageShotContent() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();

  return (
    <>
      <TeamSubscriptionBenefitsCard
        singleSigUsed={MOCK_SINGLE_SIG_USED}
        singleSigMax={MOCK_SINGLE_SIG_MAX}
        multiSigUsed={MOCK_MULTI_SIG_USED}
        multiSigMax={MOCK_MULTI_SIG_MAX}
        addressCount={MOCK_WALLET_ADDRESS_COUNT}
        onExpandSingleSig={() => undefined}
        onExpandMultiSig={() => undefined}
        onPressAddresses={() => undefined}
      />

      <TeamSubscriptionSection title={t('team.sectionAccountFinance')} pageGutter={false}>
        <EgDataList sceneContentInset={0} rowGap={edsPx(spacing['spacing-0'])}>
          <TeamSubscriptionDisclosureRow
            label={t('team.subscriptionOverview')}
            value={MOCK_OVERVIEW_BALANCE}
            onPress={() => undefined}
            accessibilityLabel={t('team.subscriptionOverview')}
          />
          <TeamSubscriptionDisclosureRow
            label={t('team.feeRecords')}
            value={t('team.feeRecordsSubtitle')}
            onPress={() => undefined}
            accessibilityLabel={t('team.feeRecords')}
          />
          <TeamSubscriptionDisclosureRow
            label={t('team.gasPaymentRecords')}
            value={t('team.gasPaymentRecordsSubtitle')}
            onPress={() => undefined}
            accessibilityLabel={t('team.gasPaymentRecords')}
          />
          <TeamSubscriptionDisclosureRow
            label={t('team.subscriptionAutoRenewManagement')}
            value={t('team.subscriptionAutoRenewTagline')}
            onPress={() => undefined}
            accessibilityLabel={t('team.subscriptionAutoRenewManagement')}
          />
          <TeamSubscriptionDisclosureRow
            label={t('team.orders')}
            value={t('team.subscriptionOrdersEmpty')}
            onPress={() => undefined}
            accessibilityLabel={t('team.orders')}
            isLast
          />
        </EgDataList>
      </TeamSubscriptionSection>

      <TeamSubscriptionSupportBanner />
    </>
  );
});