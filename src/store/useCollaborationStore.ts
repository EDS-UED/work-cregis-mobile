import { create } from 'zustand';

export type CollaborationItem = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
};

type CollaborationState = {
  items: CollaborationItem[];
  selectedId: string | null;
  selectItem: (id: string) => void;
  loadMockItems: () => void;
};

const mockItems: CollaborationItem[] = [
  { id: 'APR-000001', title: 'Approval request #1', status: 'pending' },
  { id: 'SIG-000001', title: 'Signing request #1', status: 'pending' },
  { id: 'APR-000002', title: 'Approval request #2', status: 'approved' },
];

export const useCollaborationStore = create<CollaborationState>((set) => ({
  items: mockItems,
  selectedId: null,
  selectItem: (id) => set({ selectedId: id }),
  loadMockItems: () => set({ items: mockItems, selectedId: null }),
}));
