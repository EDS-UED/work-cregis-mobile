import type { TeamMemberRow, TeamMemberTag } from '@/scenes/team/detail/teamMemberDetailMock';

export type TeamMemberListBucket =
  | 'creator'
  | 'pending'
  | 'admin'
  | 'regular'
  | 'otherRole'
  | 'other';

export const TEAM_MEMBER_SECTION_ORDER: readonly TeamMemberListBucket[] = [
  'creator',
  'pending',
  'admin',
  'regular',
  'otherRole',
  'other',
] as const;

export type TeamMemberSectionBlock = {
  bucket: TeamMemberListBucket;
  rows: TeamMemberRow[];
};

const IDENTITY_TAGS = ['owner', 'self'] as const;

function stableMemberOrder(a: TeamMemberRow, b: TeamMemberRow): number {
  const ai = Number.parseInt(a.id.replace(/\D+/g, ''), 10);
  const bi = Number.parseInt(b.id.replace(/\D+/g, ''), 10);
  return ai - bi;
}

export function groupTeamMembersBySection(rows: TeamMemberRow[]): TeamMemberSectionBlock[] {
  const buckets: Record<TeamMemberListBucket, TeamMemberRow[]> = {
    creator: [],
    pending: [],
    admin: [],
    regular: [],
    otherRole: [],
    other: [],
  };
  for (const row of rows) {
    buckets[row.bucket].push(row);
  }
  return TEAM_MEMBER_SECTION_ORDER.map((bucket) => ({
    bucket,
    rows: [...buckets[bucket]].sort(stableMemberOrder),
  })).filter((block) => block.rows.length > 0);
}

/** 分组内行 tag · 待加入区不展示「待加入」；普通成员区保留禁用 / 已移除。 */
export function memberRowDisplayTags(
  tags: Exclude<TeamMemberTag, null>[],
  bucket: TeamMemberListBucket,
): Exclude<TeamMemberTag, null>[] {
  if (bucket === 'pending') {
    return tags.filter((tag): tag is (typeof IDENTITY_TAGS)[number] =>
      (IDENTITY_TAGS as readonly string[]).includes(tag),
    );
  }
  if (bucket === 'regular') {
    return tags.filter(
      (tag) =>
        tag === 'disabled' ||
        tag === 'removed' ||
        (IDENTITY_TAGS as readonly string[]).includes(tag),
    );
  }
  return tags.filter(
    (tag) =>
      tag !== 'pending' &&
      ((IDENTITY_TAGS as readonly string[]).includes(tag) ||
        tag === 'disabled' ||
        tag === 'removed'),
  );
}

const TEAM_MEMBER_SECTION_TITLE_KEYS = {
  creator: 'team.memberSectionCreator',
  pending: 'team.memberSectionPending',
  admin: 'team.memberSectionAdmin',
  regular: 'team.memberSectionRegular',
  otherRole: 'team.memberSectionOtherRole',
  other: 'team.memberSectionOther',
} as const;

export function teamMemberSectionTitleKey(
  bucket: TeamMemberListBucket,
): (typeof TEAM_MEMBER_SECTION_TITLE_KEYS)[TeamMemberListBucket] {
  return TEAM_MEMBER_SECTION_TITLE_KEYS[bucket];
}