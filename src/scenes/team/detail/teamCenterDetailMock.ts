export type TeamSecurityRowId =
  | 'enterpriseVerification'
  | 'addressBookVerification'
  | 'riskControl'
  | 'inviteMembers';

export type {
  TeamMemberRow,
  TeamMemberRowId,
  TeamMemberTag,
} from '@/scenes/team/detail/teamMemberDetailMock';
export { TEAM_MEMBER_ROWS } from '@/scenes/team/detail/teamMemberDetailMock';

export type { TeamRoleRow } from '@/scenes/team/detail/teamRoleDetailMock';
export { TEAM_ROLE_ROWS } from '@/scenes/team/detail/teamRoleDetailMock';

export type { TeamAddressBookRow } from '@/scenes/team/detail/teamAddressBookDetailMock';
export { TEAM_ADDRESS_BOOK_ROWS } from '@/scenes/team/detail/teamAddressBookDetailMock';

export const TEAM_SECURITY_ROW_ORDER: TeamSecurityRowId[] = [
  'enterpriseVerification',
  'addressBookVerification',
  'riskControl',
  'inviteMembers',
];
