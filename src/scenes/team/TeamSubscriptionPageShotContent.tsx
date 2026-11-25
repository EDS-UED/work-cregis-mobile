import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { TeamSubscriptionAccountFinanceGroup } from '@/scenes/team/TeamSubscriptionAccountFinanceGroup';
import { TeamSubscriptionBenefitsCard } from '@/scenes/team/TeamSubscriptionBenefitsCard';
import { TeamSubscriptionSection } from '@/scenes/team/TeamSubscriptionSection';
import { TeamSubscriptionSectionsDivider } from '@/scenes/team/TeamSubscriptionSectionsDivider';
import { TeamSubscriptionSupportBanner } from '@/scenes/team/TeamSubscriptionSupportBanner';

const MOCK_WALLET_ADDRESS_COUNT = 99;
const MOCK_SINGLE_SIG_USED = 1;
const MOCK_SINGLE_SIG_MAX = 5;
const MOCK_MULTI_SIG_USED = 2;
const MOCK_MULTI_SIG_MAX = 5;

/** 订阅 page-shot 正文（Hero 在 `TeamPlanPageShotHero`）· 与卡片间距见根页 `paddingTop: spacing-8`。 */
export const TeamSubscriptionPageShotContent = memo(function TeamSubscriptionPageShotContent() {
  const { t } = useTranslation();

  return (
    <>
      <TeamSubscriptionSection
        title={t('team.benefits')}
        pageGutter={false}
        titleBodyGap="spacing-2"
      >
        <TeamSubscriptionBenefitsCard
          showSectionTitle={false}
          singleSigUsed={MOCK_SINGLE_SIG_USED}
          singleSigMax={MOCK_SINGLE_SIG_MAX}
          multiSigUsed={MOCK_MULTI_SIG_USED}
          multiSigMax={MOCK_MULTI_SIG_MAX}
          addressCount={MOCK_WALLET_ADDRESS_COUNT}
          onExpandSingleSig={() => undefined}
          onExpandMultiSig={() => undefined}
          onPressAddresses={() => undefined}
        />
      </TeamSubscriptionSection>

      <TeamSubscriptionSectionsDivider />

      <TeamSubscriptionSection title={t('team.sectionAccountFinance')} pageGutter={false} titleBodyGap="spacing-2">
        <TeamSubscriptionAccountFinanceGroup />
      </TeamSubscriptionSection>

      <TeamSubscriptionSupportBanner />
    </>
  );
});