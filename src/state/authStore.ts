import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = 'auth-storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,

  setAuth: (token, user) => {
    set({ token, user });
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
  },

  clearAuth: () => {
    set({ token: null, user: null });
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  hydrateAuth: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const { token, user } = JSON.parse(raw);
        if (token && user) set({ token, user });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },
}));
