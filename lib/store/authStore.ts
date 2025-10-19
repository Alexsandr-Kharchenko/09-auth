import { create, type StoreApi } from 'zustand';
import type { User } from '@/types/user';

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // нове поле
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  setIsLoading: (loading: boolean) => void; // новий метод
};

type SetState = StoreApi<AuthState>['setState'];

export const useAuthStore = create<AuthState>()((set: SetState) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // дефолт true
  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),
  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
