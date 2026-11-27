import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';
import { TeamAddressBookDetailContent } from '@/scenes/team/detail/TeamAddressBookDetailContent';
import { TeamAmlDetailContent } from '@/scenes/team/detail/TeamAmlDetailContent';
import { TeamInfoDetailContent } from '@/scenes/team/detail/TeamInfoDetailContent';
import { TeamRolesDetailContent } from '@/scenes/team/detail/TeamRolesDetailContent';
import { TeamSecurityDetailContent } from '@/scenes/team/detail/TeamSecurityDetailContent';

type TeamCenterDetailBodyProps = {
  id: TeamCenterDetailId;
};

export function TeamCenterDetailBody({ id }: TeamCenterDetailBodyProps) {
  switch (id) {
    case 'teamSecurity':
      return <TeamSecurityDetailContent />;
    case 'roleManagement':
      return <TeamRolesDetailContent />;
    case 'addressBook':
      return <TeamAddressBookDetailContent />;
    case 'aml':
      return <TeamAmlDetailContent />;
    case 'teamInfo':
      return <TeamInfoDetailContent />;
    case 'teamAccount':
      return null;
    default:
      return null;
  }
}