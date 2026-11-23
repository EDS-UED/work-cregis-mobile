import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';

import companyAvatar from '../../assets/company-avatar.png';
import companyAvatar1 from '../../assets/company-avatar-1.png';
import companyAvatar2 from '../../assets/company-avatar-2.png';
import companyAvatar3 from '../../assets/company-avatar-3.png';
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

export type HomeTodoSheetBusinessType = 'paymentRequest' | 'withdrawal';

export type HomeTodoSheetDetail = {
  initiatorName: string;
  initiatorEmail: string;
  initiatorColorIndex: number;
  recipientAddress: string;
  businessType: HomeTodoSheetBusinessType;
  occurredAt: string;
  remark: string | null;
};

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
  detail: HomeTodoSheetDetail;
};

/** 与首页顶栏 `companyName` 一致 · 切换列表默认第 2 项。 */
const MOCK_COMPANY_NAME = 'Quant Inc.';

/** 四个团队各对应一档版本（基础 / 高级 / 商业 / 企业）。 */
const TEAM_SWITCHER_SEED: TeamSwitcherItem[] = [
  {
    id: 'tm_tony',
    name: '深度求锁科技',
    planTier: 'basic',
    colorIndex: 4,
    avatarSource: companyAvatar1,
  },
  {
    id: 'tm_product',
    name: MOCK_COMPANY_NAME,
    planTier: 'advanced',
    avatarSource: companyAvatar,
  },
  {
    id: 'tm_hello',
    name: 'ClearPath Ltd.',
    planTier: 'business',
    colorIndex: 7,
    avatarSource: companyAvatar2,
  },
  {
    id: 'tm_test2',
    name: 'Bridge Inc.',
    planTier: 'enterprise',
    colorIndex: 1,
    avatarSource: companyAvatar3,
  },
];

type HomeState = {
  companyName: string;
  activeTeamId: string;
  teams: TeamSwitcherItem[];
  setActiveTeam: (teamId: string) => void;
  setTeamSwitcherOrder: (teams: TeamSwitcherItem[]) => void;
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

/** @see `.cursor/rules/work.md` §4.3 */
export const HOME_TODO_MOCK_CURRENCIES_FIRST_10 = [
  'HYPE',
  'TON',
  'ZEC',
  'USDT',
  'AAVE',
  'MNT',
  'GBG',
  '1INCH',
  'DEEP',
  'AVAX',
] as const;

const todoDetailTemplates: HomeTodoSheetDetail[] = [
  {
    initiatorName: 'Campos',
    initiatorEmail: 'bosscao@gmail.com',
    initiatorColorIndex: 0,
    recipientAddress: '0x3328309c493309c49ab12cd8e',
    businessType: 'paymentRequest',
    occurredAt: '2027-11-28 13:23:45',
    remark: null,
  },
  {
    initiatorName: 'Alex Mah.',
    initiatorEmail: 'alex.mah@quant.inc',
    initiatorColorIndex: 0,
    recipientAddress: '0x91f2b8e44a0c12df9e8b01',
    businessType: 'paymentRequest',
    occurredAt: '2027-06-08 16:07:00',
    remark: null,
  },
  {
    initiatorName: 'Project Name',
    initiatorEmail: 'ops@quant.inc',
    initiatorColorIndex: 0,
    recipientAddress: '0xac1200ff3311bb2200ee99',
    businessType: 'withdrawal',
    occurredAt: '2027-06-08 16:07:00',
    remark: '月末结算',
  },
];

const todoTemplates: Omit<HomeTodoItem, 'id' | 'category' | 'currency' | 'detail'>[] = [
  {
    amount: '1.0035',
    descriptionHighlight: 'Campos',
    descriptionRest: ' 发起付款申请',
    timestamp: '11-28 13:23',
  },
  {
    amount: '2.000000078',
    descriptionHighlight: 'Alex Mah.',
    descriptionRest: ' 发起付款申请',
    timestamp: '06-08 16:07',
  },
  {
    amount: '5,087.005',
    descriptionHighlight: 'Name',
    descriptionRest: ' 发起提现',
    timestamp: '06-08 16:07',
  },
];

function mockTodoCurrencyForSeq(seq: number): string {
  const order = HOME_TODO_MOCK_CURRENCIES_FIRST_10;
  return order[(seq - 1) % order.length]!;
}

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
      const templateIndex = (seq - 1) % todoTemplates.length;
      items.push({
        ...template,
        currency: mockTodoCurrencyForSeq(seq),
        detail: todoDetailTemplates[templateIndex]!,
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

const defaultTeam =
  TEAM_SWITCHER_SEED.find((team) => team.name === MOCK_COMPANY_NAME) ??
  TEAM_SWITCHER_SEED[1]!;

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
  setTeamSwitcherOrder: (teams) => {
    const { activeTeamId } = get();
    const active = teams.find((item) => item.id === activeTeamId);
    if (active) {
      set({ teams });
      return;
    }
    const fallback = teams[0];
    if (!fallback) {
      set({ teams });
      return;
    }
    set({
      teams,
      activeTeamId: fallback.id,
      teamDisplayName: fallback.name,
      teamId: fallback.id,
      teamPlanTier: fallback.planTier,
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
