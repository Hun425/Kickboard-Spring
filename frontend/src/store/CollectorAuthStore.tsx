import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  accessToken: string | null;
  role: string | null;
  area: string | null;
  setAuthData: (token: string, role: string, area: string) => void;
  clearAuthData: () => void;
};

export const useCollectorAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  accessToken: null,
  role: null,
  area: null,
  setAuthData: (token, role, area) => set({ accessToken: token, role, area }),
  clearAuthData: () => set({ accessToken: null, role: null, area: null }),
}));
