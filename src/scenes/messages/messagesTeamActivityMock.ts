import type { ImageSourcePropType } from 'react-native';

import companyAvatar from '../../../assets/company-avatar.png';

export type TeamActivityKind =
  | 'inviteJoin'
  | 'memberJoinedTeam'
  | 'memberJoinedWallet'
  | 'teamDissolved'
  | 'removedFromTeam'
  | 'removedFromWallet';

const TEAM_ACTIVITY_KINDS: TeamActivityKind[] = [
  'inviteJoin',
  'memberJoinedTeam',
  'memberJoinedWallet',
  'teamDissolved',
  'removedFromTeam',
  'removedFromWallet',
];

/** 第 7 条起随机池 · 移出类降权（约 10% 出现移出）。 */
const TEAM_ACTIVITY_RANDOM_KINDS: TeamActivityKind[] = [
  'inviteJoin',
  'memberJoinedTeam',
  'memberJoinedWallet',
  'teamDissolved',
];

/** Mock · 团队动态统一团队 · Quant Inc. + 企业 Logo。 */
const MESSAGE_TEAM_ACTIVITY_TEAM = {
  name: 'Quant Inc.',
  colorIndex: 2,
  avatarSource: companyAvatar as ImageSourcePropType,
};

/** Mock · 六段日期条数：今天 1 · 次日 3 · 第三日 2 · 其余 9+9+8 = 32。 */
export const MESSAGE_TEAM_ACTIVITY_PER_SECTION = [1, 3, 2, 9, 9, 8] as const;

/** web3 原色盘 · 偏蓝/青/紫蓝（见 EDS `AVATAR_NATIVE_PALETTE` 索引）。 */
const MEMBER_AVATAR_BLUEISH_COLOR_INDICES = [
  0, 6, 15, 18, 19, 8, 13, 0, 6, 15, 18, 19, 8, 13, 0, 6, 15, 18, 19, 8,
] as const;

/** 20 人 · 70% 普通中文名（两字/三字，非名人）+ 30% 英文名。 */
const MEMBER_DISPLAY_NAMES = [
  '王磊',
  '李静',
  '张志强',
  '刘芳',
  '陈雨桐',
  '杨帆',
  '赵军',
  '黄淑芬',
  '周强',
  '吴佳',
  '徐洋',
  '孙丽华',
  '马建国',
  '朱敏',
  'Alex Mah.',
  'Cooper Lin',
  'Mia Zhang',
  'Jordan Lee',
  'Taylor Kim',
  'Quinn Wang',
] as const;

/** Mock · 20 名成员 · 蓝色系头像底。 */
export const MESSAGE_TEAM_ACTIVITY_MEMBERS = MEMBER_DISPLAY_NAMES.map((name, i) => ({
  name,
  colorIndex: MEMBER_AVATAR_BLUEISH_COLOR_INDICES[i]!,
}));

const MESSAGE_TEAM_ACTIVITY_WALLETS = [
  'Quant Vault',
  'Treasury Main',
  'Ops Reserve',
  'Settlement Pool',
  'Cold Storage A',
  'Payroll Wallet',
] as const;

export type MessageTeamActivityMock = {
  kind: TeamActivityKind;
  teamName: string;
  teamColorIndex?: number;
  teamAvatarSource?: ImageSourcePropType;
  walletName?: string;
  memberName?: string;
  memberColorIndex?: number;
};

function mockSeededUnit(seed: number): number {
  return (seed * 1103515245 + 12345) & 0x7fffffff;
}

function pickTeamActivityKind(index: number): TeamActivityKind {
  if (index < TEAM_ACTIVITY_KINDS.length) {
    return TEAM_ACTIVITY_KINDS[index]!;
  }
  const unit = mockSeededUnit(index + 97);
  if (unit % 10 === 0) {
    return unit % 20 === 0 ? 'removedFromTeam' : 'removedFromWallet';
  }
  return TEAM_ACTIVITY_RANDOM_KINDS[unit % TEAM_ACTIVITY_RANDOM_KINDS.length]!;
}

function pickFromPool<T>(index: number, salt: number, pool: readonly T[]): T {
  const unit = mockSeededUnit(index * 31 + salt);
  return pool[unit % pool.length]!;
}

export function buildTeamActivityMockPayload(index: number): MessageTeamActivityMock {
  const kind = pickTeamActivityKind(index);
  const member =
    index < TEAM_ACTIVITY_KINDS.length
      ? MESSAGE_TEAM_ACTIVITY_MEMBERS[index]!
      : pickFromPool(index, 1, MESSAGE_TEAM_ACTIVITY_MEMBERS);
  const wallet =
    index < TEAM_ACTIVITY_KINDS.length
      ? MESSAGE_TEAM_ACTIVITY_WALLETS[index % MESSAGE_TEAM_ACTIVITY_WALLETS.length]!
      : pickFromPool(index, 3, MESSAGE_TEAM_ACTIVITY_WALLETS);

  return {
    kind,
    teamName: MESSAGE_TEAM_ACTIVITY_TEAM.name,
    teamColorIndex: MESSAGE_TEAM_ACTIVITY_TEAM.colorIndex,
    teamAvatarSource: MESSAGE_TEAM_ACTIVITY_TEAM.avatarSource,
    walletName: wallet,
    memberName: member.name,
    memberColorIndex: member.colorIndex,
  };
}
