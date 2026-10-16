import { create } from 'zustand';

export type HomeTodoFilter = 'approval' | 'sign' | 'errorCallback';

export type HomeTodoItem = {
  id: string;
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

const todoTemplates: Omit<HomeTodoItem, 'id'>[] = [
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

const initialTodoItems: HomeTodoItem[] = Array.from({ length: 24 }, (_, index) => ({
  ...todoTemplates[index % todoTemplates.length]!,
  id: `todo-${index + 1}`,
}));

export const useHomeStore = create<HomeState>((set) => ({
  companyName: 'Quant Inc.',
  userDisplayName: 'Alex Mah.',
  userAvatarColorIndex: 2,
  totalBalanceDisplay: '$ 730,650.83',
  balanceVisible: true,
  todoFilter: 'approval',
  filterCounts: {
    approval: 100,
    sign: 2,
    errorCallback: 0,
  },
  todoItems: initialTodoItems,
  toggleBalanceVisible: () => set((state) => ({ balanceVisible: !state.balanceVisible })),
  setTodoFilter: (todoFilter) => set({ todoFilter }),
}));
