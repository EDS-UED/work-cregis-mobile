import { useTranslation } from 'react-i18next';

import { useHomeStore } from '@/store';
import { TeamNavTitleRow } from '@/scenes/team/TeamNavTitleRow';

export { TEAM_NAV_CHEVRON_PX } from '@/scenes/team/TeamNavTitleRow';

type TeamCenterNavTitleProps = {
  onOpenSwitcher: () => void;
};

/** 系统 Nav 标题：团队头像 sm + 名称（同首页公司名）+ 下拉箭头 · 点开切换 Sheets。 */
export function TeamCenterNavTitle({ onOpenSwitcher }: TeamCenterNavTitleProps) {
  const { t } = useTranslation();
  const teamDisplayName = useHomeStore((state) => state.teamDisplayName);

  return (
    <TeamNavTitleRow
      showChevron
      interactive
      onPress={onOpenSwitcher}
      accessibilityLabel={t('team.openSwitcher', { name: teamDisplayName })}
    />
  );
}
