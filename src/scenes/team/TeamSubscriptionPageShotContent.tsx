import { memo } from 'react';

import { TeamSubscriptionAccountFinanceGroup } from '@/scenes/team/TeamSubscriptionAccountFinanceGroup';
import { TeamSubscriptionBenefitsCard } from '@/scenes/team/TeamSubscriptionBenefitsCard';
import { TeamSubscriptionSectionsDivider } from '@/scenes/team/TeamSubscriptionSectionsDivider';
import { TeamSubscriptionSupportBanner } from '@/scenes/team/TeamSubscriptionSupportBanner';

/** 订阅 page-shot 正文 · 权益｜5 条 item｜各以 module 分割线隔开 · 无区段标题。 */
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