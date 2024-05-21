import { create, StoreApi, UseBoundStore } from 'zustand';
import { createClearable } from './createClearable';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface AuthActions {
  setUserName: (value: string) => void;
  setAuthState: (value: Partial<AuthState>) => void;
  removeAuthState: () => void;
}

interface AuthState {
  userName: string;
  accessToken: string | null;
}

interface AuthStore extends AuthState {
  actions: AuthActions;
}

const initialState: AuthState = {
  userName: '',
  accessToken: null,
};

const authStorage: StateStorage = {
  setItem: async (name, value) => {
    return await SecureStore.setItemAsync(name, value);
  },
  getItem: async name => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  removeItem: async name => {
    return await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore: UseBoundStore<StoreApi<AuthStore>> =
  createClearable<AuthStore>()(
    persist(
      (set, get) => ({
        ...initialState,
        actions: {
          setUserName: name => set(() => ({ userName: name })),
          setAuthState: value => set(prev => ({ ...prev, ...value })),
          removeAuthState: () => set(initialState),
        },
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => authStorage),
        partialize: state =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => !['actions'].includes(key)),
          ),
      },
    ),
  );
