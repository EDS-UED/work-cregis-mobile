import { memo } from 'react';

import { TeamSubscriptionAccountFinanceGroup } from '@/scenes/team/TeamSubscriptionAccountFinanceGroup';
import { TeamSubscriptionBenefitsCard } from '@/scenes/team/TeamSubscriptionBenefitsCard';
import { TeamSubscriptionSectionsDivider } from '@/scenes/team/TeamSubscriptionSectionsDivider';
import { TeamSubscriptionSupportBanner } from '@/scenes/team/TeamSubscriptionSupportBanner';

/** 订阅 page-shot 正文 · 双 `EgItemGroup` + module 分割线 · 无区段标题。 */
export const TeamSubscriptionPageShotContent = memo(function TeamSubscriptionPageShotContent() {
  return (
    <>
      <TeamSubscriptionBenefitsCard onPressBenefits={() => undefined} />

      <TeamSubscriptionSectionsDivider />

      <TeamSubscriptionAccountFinanceGroup />

      <TeamSubscriptionSupportBanner onPressContact={() => undefined} />
    </>
  );
});