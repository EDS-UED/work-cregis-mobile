import { EgItemLeadIcon } from '@/scenes/shared/EgItemLeadIcon';

type PersonalCenterItemLeadIconProps = {
  name: string;
};

/** 个人中心 · {@link EgItemLeadIcon} */
export function PersonalCenterItemLeadIcon({ name }: PersonalCenterItemLeadIconProps) {
  return <EgItemLeadIcon name={name} />;
}