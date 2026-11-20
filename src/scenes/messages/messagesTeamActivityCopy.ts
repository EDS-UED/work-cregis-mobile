import type { MessageTeamActivityMock } from '@/scenes/messages/messagesTeamActivityMock';
import type { TFunction } from 'i18next';

export function resolveTeamActivityCopy(
  activity: MessageTeamActivityMock,
  t: TFunction,
): { title: string; subtitle: string } {
  switch (activity.kind) {
    case 'inviteJoin':
      return {
        title: activity.teamName,
        subtitle: t('messages.teamActivityInviteJoin'),
      };
    case 'memberJoinedTeam':
      return {
        title: activity.memberName ?? '',
        subtitle: t('messages.teamActivityMemberJoinedTeam', { team: activity.teamName }),
      };
    case 'memberJoinedWallet':
      return {
        title: activity.memberName ?? '',
        subtitle: t('messages.teamActivityMemberJoinedWallet', {
          wallet: activity.walletName ?? '',
        }),
      };
    case 'teamDissolved':
      return {
        title: activity.teamName,
        subtitle: t('messages.teamActivityTeamDissolved'),
      };
    case 'removedFromTeam':
      return {
        title: t('messages.teamActivityRemovedFromTeamTitle'),
        subtitle: t('messages.teamActivityRemovedFromTeamSub', { team: activity.teamName }),
      };
    case 'removedFromWallet':
      return {
        title: t('messages.teamActivityRemovedFromWalletTitle'),
        subtitle: t('messages.teamActivityRemovedFromWalletSub', {
          wallet: activity.walletName ?? '',
        }),
      };
    default:
      return { title: '', subtitle: '' };
  }
}

/** 前置页副文案 · 邀请/解散/加入用主+副，移出类仅副文本。 */
export function formatTeamActivityHubSubtitle(
  activity: MessageTeamActivityMock,
  t: TFunction,
): string {
  const { title, subtitle } = resolveTeamActivityCopy(activity, t);
  switch (activity.kind) {
    case 'removedFromTeam':
    case 'removedFromWallet':
      return subtitle;
    default:
      return title ? `${title} ${subtitle}` : subtitle;
  }
}