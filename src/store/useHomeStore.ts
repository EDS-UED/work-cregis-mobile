import { create } from 'zustand';

type HomeState = {
  summaryLabel: string;
  pendingTasks: number;
  refreshSummary: () => void;
};

export const useHomeStore = create<HomeState>((set) => ({
  summaryLabel: 'mock-home-summary',
  pendingTasks: 3,
  refreshSummary: () =>
    set({
      summaryLabel: 'mock-home-summary',
      pendingTasks: Math.floor(Math.random() * 5),
    }),
}));
