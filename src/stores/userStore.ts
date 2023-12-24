import { create, StateCreator } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { immer } from 'zustand/middleware/immer';
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

export const MMKVStorage = new MMKV({
  id: 'MMKVKey',
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return MMKVStorage.set(name, value);
  },
  getItem: name => {
    const value = MMKVStorage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return MMKVStorage.delete(name);
  },
};

const createUserStore: StateCreator<{
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User) => void;
  logOut: () => void;
}> = (set, get) => ({
  user: null,
  setUser: (user: FirebaseAuthTypes.User) => set({ user }),
  logOut: () => set({ user: null }),
});

export const useUserStore = create(
  persist(devtools(createUserStore), {
    name: 'user-storage',
    storage: createJSONStorage(() => zustandStorage),
  }),
);
