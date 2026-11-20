/** 团队中心 · 子页占位 id（Stack `TeamCenterDetail`）。 */
export type TeamCenterDetailId =
  | 'management'
  | 'subscription'
  | 'security'
  | 'members'
  | 'addressBook'
  | 'aml'
  | 'rolesManagement'
  | 'appMarketRolesManagement';

export type TeamCenterDetailMeta = {
  titleKey:
    | 'team.sectionManagement'
    | 'team.teamSubscriptionTitle'
    | 'team.teamSecurity'
    | 'team.members'
    | 'team.addressBook'
    | 'team.aml'
    | 'team.teamRolesManagementPage'
    | 'team.appMarketRolesManagementPage';
  /** 与 `SceneScaffold` / 交易记录 Tab 一致用默认 `box-page`。 */
  pageBackground?: 'default' | 'card';
};

export const TEAM_CENTER_DETAIL_META: Record<
  TeamCenterDetailId,
  TeamCenterDetailMeta
> = {
  management: { titleKey: 'team.sectionManagement' },
  subscription: { titleKey: 'team.teamSubscriptionTitle', pageBackground: 'default' },
  security: { titleKey: 'team.teamSecurity' },
  members: { titleKey: 'team.members' },
  addressBook: { titleKey: 'team.addressBook' },
  aml: { titleKey: 'team.aml' },
  rolesManagement: { titleKey: 'team.teamRolesManagementPage' },
  appMarketRolesManagement: {
    titleKey: 'team.appMarketRolesManagementPage',
  },
};

export function teamCenterDetailMeta(
  id: TeamCenterDetailId,
): TeamCenterDetailMeta {
  return TEAM_CENTER_DETAIL_META[id];
}