import { create } from 'zustand';

import { mockCollaborationItems } from '@/scenes/collaboration/collaborationListMock';

export type CollaborationSignKind = 'single' | 'multi' | 'approval';

export type CollaborationItem = {
  id: string;
  amount: string;
  currency: string;
  initiatorName: string;
  actionKey:
    | 'paymentRequest'
    | 'withdrawal'
    | 'contractSign'
    | 'policyApproval';
  timestamp: string;
  signKind: CollaborationSignKind;
  avatarLetter: string;
  avatarColorIndex: number;
  chainSymbol?: string;
};

type CollaborationState = {
  items: CollaborationItem[];
  /** 列表标题旁角标（Mock）。 */
  headerBadgeCount: number;
  /** 汇总行「条待办数据」（Mock）。 */
  totalPendingCount: number;
  selectedId: string | null;
  selectItem: (id: string) => void;
  loadMockItems: () => void;
};

export const useCollaborationStore = create<CollaborationState>((set) => ({
  items: mockCollaborationItems,
  headerBadgeCount: 27,
  totalPendingCount: 40562,
  selectedId: null,
  selectItem: (id) => set({ selectedId: id }),
  loadMockItems: () =>
    set({
      items: mockCollaborationItems,
      headerBadgeCount: 27,
      totalPendingCount: 40562,
      selectedId: null,
    }),
}));
