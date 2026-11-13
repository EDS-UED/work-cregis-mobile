import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';

import companyAvatar from '../../assets/company-avatar.png';
import {
  DEFAULT_QUICK_ENTRY_IDS,
  type QuickServiceId,
} from '@/scenes/home/homeQuickServicesCatalog';

export type TeamPlanTier = 'basic' | 'advanced' | 'business' | 'enterprise';

export type TeamSwitcherItem = {
  id: string;
  name: string;
  planTier: TeamPlanTier;
  avatarSource?: ImageSourcePropType;
  colorIndex?: number;
};

export type HomeTodoFilter = 'approval' | 'sign' | 'errorCallback';

export type HomeTodoItem = {
  id: string;
  category: HomeTodoFilter;
  amount: string;
  currency: string;
  /** 副文本加粗前缀（如 Project Name） */
  descriptionHighlight: string;
  /** 副文本常规后缀（含 leading space，如 " Request for withdrawal"） */
  descriptionRest: string;
  timestamp: string;
};

/** 与首页顶栏 `companyName` 一致 · 切换列表默认第 2 项。 */
const MOCK_COMPANY_NAME = 'Quant Inc.';

/** 四个团队各对应一档版本（基础 / 高级 / 商业 / 企业）。 */
const TEAM_SWITCHER_SEED: TeamSwitcherItem[] = [
  { id: 'tm_tony', name: '深度求锁科技', planTier: 'basic', colorIndex: 4 },
  {
    id: 'tm_product',
    name: MOCK_COMPANY_NAME,
    planTier: 'advanced',
    avatarSource: companyAvatar,
  },
  { id: 'tm_hello', name: 'ClearPath Ltd.', planTier: 'business', colorIndex: 7 },
  { id: 'tm_test2', name: 'Bridge Inc.', planTier: 'enterprise', colorIndex: 1 },
];

type HomeState = {
  companyName: string;
  activeTeamId: string;
  teams: TeamSwitcherItem[];
  setActiveTeam: (teamId: string) => void;
  teamDisplayName: string;
  teamPlanTier: TeamPlanTier;
  teamSubscriptionExpires: string;
  teamId: string;
  teamAccountBalance: string;
  teamGasBalance: string;
  teamGasBalanceFiat: string;
  userDisplayName: string;
  userAvatarColorIndex: number;
  totalBalanceDisplay: string;
  balanceVisible: boolean;
  todoFilter: HomeTodoFilter;
  filterCounts: Record<HomeTodoFilter, number>;
  todoItems: HomeTodoItem[];
  /** 首页快捷入口（最多 7）· 与服务 Sheet 同步。 */
  quickEntryIds: QuickServiceId[];
  setQuickEntryIds: (ids: QuickServiceId[]) => void;
  toggleBalanceVisible: () => void;
  setTodoFilter: (filter: HomeTodoFilter) => void;
};

const todoTemplates: Omit<HomeTodoItem, 'id' | 'category'>[] = [
  {
    amount: '100.00035',
    currency: 'BCH',
    descriptionHighlight: 'Project Name',
    descriptionRest: ' Request for withdrawal',
    timestamp: 'Jun 08, 16:07',
  },
  {
    amount: '2.000000078',
    currency: 'LTC',
    descriptionHighlight: 'Alex Mah.',
    descriptionRest: ' Initiated a payment request',
    timestamp: 'Jun 08, 16:07',
  },
  {
    amount: '5,087.005',
    currency: 'AVAX',
    descriptionHighlight: 'Name',
    descriptionRest: ' withdrawal via',
    timestamp: 'Jun 08, 16:07',
  },
];

function buildInitialTodoItems(): HomeTodoItem[] {
  const counts: Record<HomeTodoFilter, number> = {
    approval: 0,
    sign: 32,
    errorCallback: 8,
  };
  const items: HomeTodoItem[] = [];
  let seq = 1;
  for (const category of ['approval', 'sign', 'errorCallback'] as const) {
    const total = counts[category];
    for (let i = 0; i < total; i += 1) {
      const template = todoTemplates[(seq - 1) % todoTemplates.length]!;
      items.push({
        ...template,
        id: `todo-${seq}`,
        category,
      });
      seq += 1;
    }
  }
  return items;
}

const initialTodoItems = buildInitialTodoItems();

function todoFilterCounts(items: HomeTodoItem[]): Record<HomeTodoFilter, number> {
  return {
    approval: items.filter((item) => item.category === 'approval').length,
    sign: items.filter((item) => item.category === 'sign').length,
    errorCallback: items.filter((item) => item.category === 'errorCallback').length,
  };
}

const defaultTeam = TEAM_SWITCHER_SEED[1]!;

export const useHomeStore = create<HomeState>((set, get) => ({
  companyName: MOCK_COMPANY_NAME,
  activeTeamId: defaultTeam.id,
  teams: TEAM_SWITCHER_SEED,
  setActiveTeam: (teamId) => {
    const team = get().teams.find((item) => item.id === teamId);
    if (!team) return;
    set({
      activeTeamId: teamId,
      teamDisplayName: team.name,
      teamId,
      teamPlanTier: team.planTier,
    });
  },
  teamDisplayName: defaultTeam.name,
  teamPlanTier: defaultTeam.planTier,
  teamSubscriptionExpires: '2028.12.30',
  teamId: defaultTeam.id,
  teamAccountBalance: '$ 1,280.50',
  teamGasBalance: '0.045 ETH',
  teamGasBalanceFiat: '($145.20)',
  userDisplayName: 'Alex Mah.',
  /** DS 头像色板 index 1 · `web3-avatar-2`（`#256034`）。 */
  userAvatarColorIndex: 1,
  totalBalanceDisplay: '$ 730,650.83',
  balanceVisible: true,
  todoFilter: 'approval',
  filterCounts: todoFilterCounts(initialTodoItems),
  todoItems: initialTodoItems,
  quickEntryIds: [...DEFAULT_QUICK_ENTRY_IDS],
  setQuickEntryIds: (quickEntryIds) =>
    set({ quickEntryIds: quickEntryIds.slice(0, 7) }),
  toggleBalanceVisible: () => set((state) => ({ balanceVisible: !state.balanceVisible })),
  setTodoFilter: (todoFilter) => set({ todoFilter }),
}));
