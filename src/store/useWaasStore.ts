import { create } from 'zustand';

export type WaasProject = {
  id: string;
  name: string;
};

type WaasShellView = 'empty' | 'create' | 'content';

type WaasState = {
  projects: WaasProject[];
  selectedProjectId: string | null;
  shellView: WaasShellView;
  openCreate: () => void;
  cancelCreate: () => void;
  createProject: (name: string) => void;
  selectProject: (id: string) => void;
};

export const useWaasStore = create<WaasState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  shellView: 'empty',
  openCreate: () => set({ shellView: 'create' }),
  cancelCreate: () =>
    set({ shellView: get().projects.length > 0 ? 'content' : 'empty' }),
  createProject: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const project: WaasProject = {
      id: `project-${Date.now()}`,
      name: trimmed,
    };

    set({
      projects: [...get().projects, project],
      selectedProjectId: project.id,
      shellView: 'content',
    });
  },
  selectProject: (id) => set({ selectedProjectId: id }),
}));
