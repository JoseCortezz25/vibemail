import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum Model {
  GPT_5_2 = 'gpt-5.2-2025-12-11',
  GPT_5_1 = 'gpt-5.1-2025-11-13',
  GPT_5_MINI = 'gpt-5-mini-2025-08-07',
  GPT_5_NANO = 'gpt-5-nano-2025-08-07',
  GEMINI_3_PRO_PREVIEW = 'gemini-3-pro-preview',
  GEMINI_FLASH_LATEST = 'gemini-2.5-flash',
  GEMINI_FLASH_LITE_LATEST = 'gemini-2.5-flash-lite'
}

export const currentModel = Model.GEMINI_FLASH_LITE_LATEST;

interface ModelStore {
  model: string;
  apiKey: string;
  hasHydrated: boolean;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string | null) => void;
  setHasHydrated: (state: boolean) => void;
}

// SSR-safe localStorage wrapper
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Silent fail for incognito mode or quota exceeded
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Silent fail
    }
  }
};

export const useModelStore = create<ModelStore>()(
  persist(
    set => ({
      model: currentModel,
      apiKey: '',
      hasHydrated: false,
      setModel: (model: string) => set({ model }),
      setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state })
    }),
    {
      name: 'model-settings',
      storage: createJSONStorage(() => safeLocalStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
      partialize: state => ({
        model: state.model,
        apiKey: state.apiKey
      })
    }
  )
);
