import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  userName: string | null;
  signIn: (userName: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userName: null,
  signIn: (userName) => set({ isAuthenticated: true, userName }),
  signOut: () => set({ isAuthenticated: false, userName: null }),
}));
