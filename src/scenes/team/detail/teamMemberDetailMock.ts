import type { TeamMemberListBucket } from '@/scenes/team/detail/teamMemberListSections';

export type TeamMemberRowId = string;

export type TeamMemberTag =
  | 'owner'
  | 'self'
  | 'pending'
  | 'disabled'
  | 'removed'
  | null;

export type TeamMemberRow = {
  id: TeamMemberRowId;
  name: string;
  email: string;
  bucket: TeamMemberListBucket;
  tags: Exclude<TeamMemberTag, null>[];
  colorIndex: number;
  active: boolean;
};

/**
 * 列表自上而下前 7 行 · Figma `web3-avatar-N` → 调色盘下标 `N - 1`。
 * @see eds-mobile `formatAvatarPaletteName`
 */
export const TEAM_MEMBER_DISPLAY_AVATAR_COLORS: readonly number[] = [
  6, 18, 16, 0, 1, 9, 13,
];

/** 第 8 行起 · 0…19 打散（确定性）。 */
const TEAM_MEMBER_AVATAR_TAIL: readonly number[] = [
  13, 18, 4, 11, 0, 16, 9, 3, 6, 8, 12, 5, 15, 3, 8, 1, 15, 12, 6, 5, 19,
];

/** 按屏上自上而下序号取头像色。 */
export function teamMemberDisplayColorIndex(visualIndex: number, fallback = 0): number {
  if (visualIndex < TEAM_MEMBER_DISPLAY_AVATAR_COLORS.length) {
    return TEAM_MEMBER_DISPLAY_AVATAR_COLORS[visualIndex] ?? fallback;
  }
  const tailIndex = visualIndex - TEAM_MEMBER_DISPLAY_AVATAR_COLORS.length;
  return TEAM_MEMBER_AVATAR_TAIL[tailIndex] ?? (visualIndex * 7 + 3) % 20;
}

/** 团队 Mock 人名池 · 28 条（成员 / 地址簿等复用）。 */
export const TEAM_MEMBER_NAME_POOL: readonly string[] = [
  'Alex Mah.',
  'Cooper',
  '荀彧',
  '大锤',
  '布丸',
  '孟获',
  'Lena Zhou',
  'Ethan Park',
  '陈星河',
  'Morgan Lee',
  '高原',
  '苏眠',
  'Noah Webb',
  '顾清欢',
  'Jamie Fox',
  '林霁',
  'Riley Chen',
  '霍言',
  'Taylor Wu',
  '白微',
  'Jordan Kim',
  '夏知遥',
  'Casey Lin',
  '方予安',
  'Drew Patel',
  '沈念',
  'Quinn Hart',
  '唐粟',
  'Vera Song',
];

/** Mock 分组 · 创建人 1 · 待加入 2 · 管理员 2 · 普通成员 8（含禁用/已移除）· 其他角色 2 · 其他人 13。 */
function memberBucketAt(index: number): TeamMemberListBucket {
  if (index === 0) return 'creator';
  if (index === 1 || index === 2) return 'admin';
  if (index === 5 || index === 17) return 'pending';
  if ([3, 4, 6, 7, 8, 9, 10, 13].includes(index)) return 'regular';
  if (index === 11 || index === 12) return 'otherRole';
  return 'other';
}

function memberTagsAt(index: number): Exclude<TeamMemberTag, null>[] {
  if (index === 0) return ['owner', 'self'];
  if (index === 5 || index === 17) return ['pending'];
  if (index === 9) return ['disabled'];
  if (index === 13) return ['removed'];
  return [];
}

function memberActiveAt(index: number, tags: Exclude<TeamMemberTag, null>[]): boolean {
  if (tags.includes('disabled') || tags.includes('removed') || tags.includes('pending')) {
    return false;
  }
  return index % 4 !== 2;
}

function memberEmailAt(index: number, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\w]+/g, '.')
    .replace(/^\.|\.$/g, '');
  const domains = ['x.com', 'qq.com', '163.com', 'gmail.com', 'hotmail.com', 'yandex.com'] as const;
  return `${slug || 'member'}.${index}@${domains[index % domains.length]}`;
}

export const TEAM_MEMBER_ROWS: TeamMemberRow[] = TEAM_MEMBER_NAME_POOL.map((name, index) => {
  const tags = memberTagsAt(index);
  return {
    id: `member-${String(index + 1).padStart(2, '0')}`,
    name,
    email: memberEmailAt(index, name),
    bucket: memberBucketAt(index),
    tags,
    colorIndex: teamMemberDisplayColorIndex(index),
    active: memberActiveAt(index, tags),
  };
});