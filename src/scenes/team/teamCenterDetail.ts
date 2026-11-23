import {
  TEAM_CENTER_MENU_LABEL_KEYS,
  type TeamCenterMenuItemId,
} from '@/scenes/team/teamCenterMenuCatalog';

/** 团队中心 · 子页路由 id（Stack `TeamCenterDetail`）。 */
export type TeamCenterDetailId = TeamCenterMenuItemId | 'teamAccount';

type TeamCenterDetailTitleKey =
  | (typeof TEAM_CENTER_MENU_LABEL_KEYS)[TeamCenterMenuItemId]
  | 'team.viewTeamAccountShort';

export function teamCenterDetailTitleKey(
  id: TeamCenterDetailId,
): TeamCenterDetailTitleKey {
  if (id === 'teamAccount') {
    return 'team.viewTeamAccountShort';
  }
  return TEAM_CENTER_MENU_LABEL_KEYS[id];
}