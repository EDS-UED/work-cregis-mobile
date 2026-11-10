import { create } from 'zustand';

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

type HomeState = {
  companyName: string;
  userDisplayName: string;
  userAvatarColorIndex: number;
  totalBalanceDisplay: string;
  balanceVisible: boolean;
  todoFilter: HomeTodoFilter;
  filterCounts: Record<HomeTodoFilter, number>;
  todoItems: HomeTodoItem[];
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

export const useHomeStore = create<HomeState>((set) => ({
  companyName: 'Quant Inc.',
  userDisplayName: 'Alex Mah.',
  userAvatarColorIndex: 2,
  totalBalanceDisplay: '$ 730,650.83',
  balanceVisible: true,
  todoFilter: 'approval',
  filterCounts: todoFilterCounts(initialTodoItems),
  todoItems: initialTodoItems,
  toggleBalanceVisible: () => set((state) => ({ balanceVisible: !state.balanceVisible })),
  setTodoFilter: (todoFilter) => set({ todoFilter }),
}));
