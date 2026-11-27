export type TeamRoleNameKey =
  | 'team.roleNameFinance'
  | 'team.roleNameSuperAdmin'
  | 'team.roleNameAdmin'
  | 'team.roleNameOps'
  | 'team.roleNameGuest'
  | 'team.roleNameAuditor'
  | 'team.roleNameDev'
  | 'team.roleNameSupport'
  | 'team.roleNameViewer'
  | 'team.roleNameBilling'
  | 'team.roleNameCompliance'
  | 'team.roleNameMarket';

export type TeamRoleRow = {
  id: string;
  nameKey: TeamRoleNameKey;
  creatorName: string;
  createdAt: string;
  /** 副文本「符号」· 创建者头像调色盘。 */
  creatorColorIndex: number;
};

/** 置顶区 · 超级管理员 → 管理员。 */
export const TEAM_ROLE_PINNED_IDS = ['superAdmin', 'admin'] as const;

/** web3 原色盘 · 偏暗系（`AVATAR_NATIVE_PALETTE` 索引）。 */
const ROLE_CREATOR_DARK_AVATAR_INDICES = [
  6, 14, 1, 13, 17, 9, 19, 10, 0, 16, 18, 15,
] as const;

/** Mock · 12 条 · 开关默认：超级管理员/管理员/运维（第 4 条）开 · 其余关。 */
export const TEAM_ROLE_ROWS: TeamRoleRow[] = [
  {
    id: 'superAdmin',
    nameKey: 'team.roleNameSuperAdmin',
    creatorName: '阎总',
    createdAt: '2024/03/18',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[0],
  },
  {
    id: 'admin',
    nameKey: 'team.roleNameAdmin',
    creatorName: 'Jacob',
    createdAt: '2024/02/09',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[1],
  },
  {
    id: 'finance',
    nameKey: 'team.roleNameFinance',
    creatorName: 'Alex Mah.',
    createdAt: '2024/03/21',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[2],
  },
  {
    id: 'ops',
    nameKey: 'team.roleNameOps',
    creatorName: 'Cooper',
    createdAt: '2024/01/12',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[3],
  },
  {
    id: 'guest',
    nameKey: 'team.roleNameGuest',
    creatorName: '大锤',
    createdAt: '2023/12/30',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[4],
  },
  {
    id: 'auditor',
    nameKey: 'team.roleNameAuditor',
    creatorName: '荀彧',
    createdAt: '2023/11/08',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[5],
  },
  {
    id: 'dev',
    nameKey: 'team.roleNameDev',
    creatorName: 'Alex Mah.',
    createdAt: '2023/10/01',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[6],
  },
  {
    id: 'support',
    nameKey: 'team.roleNameSupport',
    creatorName: 'Yan Li',
    createdAt: '2023/09/15',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[7],
  },
  {
    id: 'viewer',
    nameKey: 'team.roleNameViewer',
    creatorName: '阎总',
    createdAt: '2023/08/22',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[8],
  },
  {
    id: 'billing',
    nameKey: 'team.roleNameBilling',
    creatorName: 'Jacob',
    createdAt: '2023/07/04',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[9],
  },
  {
    id: 'compliance',
    nameKey: 'team.roleNameCompliance',
    creatorName: 'Cooper',
    createdAt: '2023/06/18',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[10],
  },
  {
    id: 'market',
    nameKey: 'team.roleNameMarket',
    creatorName: '大锤',
    createdAt: '2023/05/02',
    creatorColorIndex: ROLE_CREATOR_DARK_AVATAR_INDICES[11],
  },
];

const TEAM_ROLE_PINNED_ID_SET = new Set<string>(TEAM_ROLE_PINNED_IDS);

export function isTeamRolePinned(id: string): boolean {
  return TEAM_ROLE_PINNED_ID_SET.has(id);
}

/** 搜索命中后 · 置顶区 + 其余（保持 {@link TEAM_ROLE_ROWS} 顺序）。 */
export function partitionTeamRoleRows(filtered: TeamRoleRow[]): {
  pinned: TeamRoleRow[];
  others: TeamRoleRow[];
} {
  const byId = new Map(filtered.map((row) => [row.id, row]));
  const pinned = TEAM_ROLE_PINNED_IDS.map((id) => byId.get(id)).filter(
    (row): row is TeamRoleRow => row != null,
  );
  const filteredIds = new Set(filtered.map((row) => row.id));
  const others = TEAM_ROLE_ROWS.filter(
    (row) => filteredIds.has(row.id) && !isTeamRolePinned(row.id),
  );
  return { pinned, others };
}

export function teamRoleInitialSwitchState(): Record<string, boolean> {
  return Object.fromEntries(
    TEAM_ROLE_ROWS.map((row) => [
      row.id,
      row.id === 'superAdmin' || row.id === 'admin' || row.id === 'ops',
    ]),
  );
}