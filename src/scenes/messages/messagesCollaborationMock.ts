import { MESSAGE_TEAM_ACTIVITY_MEMBERS } from '@/scenes/messages/messagesTeamActivityMock';
import { HOME_TODO_MOCK_CURRENCIES_FIRST_10 } from '@/store/useHomeStore';

const COLLAB_MOCK_AMOUNTS = [
  '0.012',
  '2.5',
  '18.4081',
  '100.00035',
  '5,087.005',
  '0.045',
  '1,280.50',
  '12.8',
  '730,650.83',
  '0.5',
] as const;

export type MessageCollaborationMock = {
  amount: string;
  currency: string;
  memberName: string;
};

/** Mock · 协作通知 · 币种图 + 金额 + 成员发起付款。 */
export function buildCollaborationMockPayload(index: number): MessageCollaborationMock {
  const currency =
    HOME_TODO_MOCK_CURRENCIES_FIRST_10[index % HOME_TODO_MOCK_CURRENCIES_FIRST_10.length]!;
  const member = MESSAGE_TEAM_ACTIVITY_MEMBERS[index % MESSAGE_TEAM_ACTIVITY_MEMBERS.length]!;
  return {
    amount: COLLAB_MOCK_AMOUNTS[index % COLLAB_MOCK_AMOUNTS.length]!,
    currency,
    memberName: member.name,
  };
}
