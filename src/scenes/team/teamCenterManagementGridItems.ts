import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';

/** 团队管理灰底卡 · DS `EgSymbol` 与 i18n `labelKey`。 */
export const TEAM_CENTER_MANAGEMENT_GRID_ITEMS = [
  {
    testID: 'team-row-team-security',
    labelKey: 'team.teamSecurity',
    symbol: 'eds-asafety',
    detailId: 'security' as const satisfies TeamCenterDetailId,
  },
  {
    testID: 'team-row-member-management',
    labelKey: 'team.members',
    symbol: 'eds-team',
    detailId: 'members' as const satisfies TeamCenterDetailId,
  },
  {
    testID: 'team-row-role-management',
    labelKey: 'team.roles',
    symbol: 'eds-user-information',
    action: 'rolesSheet' as const,
  },
  {
    testID: 'team-row-address-book',
    labelKey: 'team.addressBook',
    symbol: 'eds-address-books',
    detailId: 'addressBook' as const satisfies TeamCenterDetailId,
  },
  {
    testID: 'team-row-aml',
    labelKey: 'team.aml',
    symbol: 'eds-text-logs-safety',
    detailId: 'aml' as const satisfies TeamCenterDetailId,
  },
] as const;