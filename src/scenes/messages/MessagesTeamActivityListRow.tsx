import { useTranslation } from 'react-i18next';

import type { MessageTeamActivityMock } from '@/scenes/messages/messagesTeamActivityMock';
import { resolveTeamActivityCopy } from '@/scenes/messages/messagesTeamActivityCopy';
import { MessagesListRow } from '@/scenes/messages/MessagesListRow';

type MessagesTeamActivityListRowProps = {
  activity: MessageTeamActivityMock;
  timeLabel: string;
  unread?: boolean;
  onPress?: () => void;
};

function resolveTeamActivityLead(activity: MessageTeamActivityMock): {
  avatarName?: string;
  avatarColorIndex?: number;
  avatarSource?: MessageTeamActivityMock['teamAvatarSource'];
  leadDangerRefuse?: boolean;
} {
  switch (activity.kind) {
    case 'inviteJoin':
    case 'teamDissolved':
      return {
        avatarName: activity.teamName,
        avatarColorIndex: activity.teamColorIndex,
        avatarSource: activity.teamAvatarSource,
      };
    case 'memberJoinedTeam':
    case 'memberJoinedWallet':
      return {
        avatarName: activity.memberName,
        avatarColorIndex: activity.memberColorIndex,
      };
    case 'removedFromTeam':
    case 'removedFromWallet':
      return { leadDangerRefuse: true };
    default:
      return {};
  }
}

/** 通知 · 团队动态 · 六种事件类型 + 对应行首。 */
export function MessagesTeamActivityListRow({
  activity,
  timeLabel,
  unread,
  onPress,
}: MessagesTeamActivityListRowProps) {
  const { t } = useTranslation();
  const { title, subtitle } = resolveTeamActivityCopy(activity, t);
  const lead = resolveTeamActivityLead(activity);

  return (
    <MessagesListRow
      title={title}
      subtitle={subtitle}
      timeLabel={timeLabel}
      unread={unread}
      onPress={onPress}
      {...lead}
    />
  );
}
