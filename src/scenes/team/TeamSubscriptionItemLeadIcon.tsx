import { EgItemLeadIcon } from '@/scenes/shared/EgItemLeadIcon';

type TeamSubscriptionItemLeadIconProps = {
  name: string;
};

/** 订阅 · {@link EgItemLeadIcon} */
export function TeamSubscriptionItemLeadIcon({ name }: TeamSubscriptionItemLeadIconProps) {
  return <EgItemLeadIcon name={name} />;
}