import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EgItem, EgItemGroup } from '@/eds/item';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamSubscriptionItemLeadIcon } from '@/scenes/team/TeamSubscriptionItemLeadIcon';
import { TEAM_SUBSCRIPTION_ITEM_ICONS } from '@/scenes/team/teamSubscriptionItemIcons';
import { teamSubscriptionEgItemGroupScreenStyle } from '@/scenes/team/teamSubscriptionItemLayout';

type TeamSubscriptionBenefitsCardProps = {
  onPressBenefits?: () => void;
};

/** 分割线以上 · 单条 `EgItem`「权益」。 */
export function TeamSubscriptionBenefitsCard({
  onPressBenefits,
}: TeamSubscriptionBenefitsCardProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();

  const groupStyle = useMemo(
    () => teamSubscriptionEgItemGroupScreenStyle(spacing),
    [spacing],
  );

  return (
    <EgItemGroup mode={mode} style={groupStyle} testID="subscription-benefits-entry">
      <EgItem
        mode={mode}
        testID="subscription-benefits"
        icon={<TeamSubscriptionItemLeadIcon name={TEAM_SUBSCRIPTION_ITEM_ICONS.benefits} />}
        label={t('team.benefits')}
        labelHeavy
        padSize="lg"
        trailingDisplay="icon"
        trailingEnabled
        showChevron
        showDivider={false}
        showPressFeedback
        onPress={onPressBenefits ?? (() => undefined)}
        accessibilityLabel={t('team.benefits')}
      />
    </EgItemGroup>
  );
}