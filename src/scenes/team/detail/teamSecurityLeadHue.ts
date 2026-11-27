import type { MessageHubLeadHueId } from '@/scenes/messages/messagesCategoryHubLeadHue';
import type { TeamSecurityRowId } from '@/scenes/team/detail/teamCenterDetailMock';

/** 团队安全行首底色（企业认证 ↔ 邀请成员 Hue 对调）。 */
export const TEAM_SECURITY_LEAD_HUE_BY_ROW: Record<
  TeamSecurityRowId,
  MessageHubLeadHueId
> = {
  enterpriseVerification: 'hue-blue',
  addressBookVerification: 'hue-green',
  riskControl: 'hue-orange',
  inviteMembers: 'hue-green-dim',
};

export const TEAM_SECURITY_LEAD_ICON_BY_ROW: Record<TeamSecurityRowId, string> = {
  enterpriseVerification: 'eds-enterprise-name',
  addressBookVerification: 'eds-text-logs-safety',
  riskControl: 'eds-database-safety',
  inviteMembers: 'eds-add-employer',
};