import { create } from 'zustand';

export type CollaborationItem = {
  id: string;
  kind: 'approval' | 'signing';
  status: 'pending' | 'approved' | 'rejected';
};

type CollaborationState = {
  items: CollaborationItem[];
  selectedId: string | null;
  selectItem: (id: string) => void;
  loadMockItems: () => void;
};

const mockItems: CollaborationItem[] = Array.from({ length: 24 }, (_, index) => {
  const kind = index % 2 === 0 ? 'approval' : 'signing';
  const prefix = kind === 'approval' ? 'APR' : 'SIG';
  const statusCycle: CollaborationItem['status'][] = ['pending', 'approved', 'rejected'];
  return {
    id: `${prefix}-${String(index + 1).padStart(6, '0')}`,
    kind,
    status: statusCycle[index % statusCycle.length],
  };
});

export const useCollaborationStore = create<CollaborationState>((set) => ({
  items: mockItems,
  selectedId: null,
  selectItem: (id) => set({ selectedId: id }),
  loadMockItems: () => set({ items: mockItems, selectedId: null }),
}));
