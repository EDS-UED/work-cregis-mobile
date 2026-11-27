/** 团队中心菜单 · 顺序、图标与 i18n / testID。 */
export type TeamCenterMenuItemId =
  | 'teamSecurity'
  | 'memberManagement'
  | 'roleManagement'
  | 'addressBook'
  | 'aml'
  | 'teamInfo';

export const TEAM_CENTER_MENU_ITEM_ORDER: TeamCenterMenuItemId[] = [
  'teamSecurity',
  'memberManagement',
  'roleManagement',
  'addressBook',
  'aml',
  'teamInfo',
];

/** 行首图形 · 线框（描边）资源 · 与 Fill 版同名去 `-fill`。 */
export const TEAM_CENTER_MENU_ICONS: Record<TeamCenterMenuItemId, string> = {
  teamSecurity: 'eds-asafety',
  memberManagement: 'eds-team',
  roleManagement: 'eds-user-information',
  addressBook: 'eds-address-books',
  aml: 'eds-database-safety',
  teamInfo: 'eds-real-name',
};

export const TEAM_CENTER_MENU_LABEL_KEYS: Record<
  TeamCenterMenuItemId,
  | 'team.teamSecurity'
  | 'team.memberManagement'
  | 'team.roleManagement'
  | 'team.addressBook'
  | 'team.aml'
  | 'team.teamInfo'
> = {
  teamSecurity: 'team.teamSecurity',
  memberManagement: 'team.memberManagement',
  roleManagement: 'team.roleManagement',
  addressBook: 'team.addressBook',
  aml: 'team.aml',
  teamInfo: 'team.teamInfo',
};

export const TEAM_CENTER_MENU_TEST_IDS: Record<TeamCenterMenuItemId, string> = {
  teamSecurity: 'team-row-team-security',
  memberManagement: 'team-row-member-management',
  roleManagement: 'team-row-role-management',
  addressBook: 'team-row-address-book',
  aml: 'team-row-aml',
  teamInfo: 'team-row-team-info',
};