import { create } from 'zustand';

export enum Model {
  GPT_5_1 = 'gpt-5.1-2025-11-13',
  GPT_5_MINI = 'gpt-5-mini-2025-08-07',
  GPT_5_NANO = 'gpt-5-nano-2025-08-07',
  GEMINI_3_PRO_PREVIEW = 'gemini-3-pro-preview',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash'
}

export const currentModel = Model.GEMINI_2_5_FLASH;

interface ModelStore {
  model: string;
  apiKey: string;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string | null) => void;
}

export const useModelStore = create<ModelStore>(set => ({
  model: currentModel,
  apiKey: '',
  setModel: (model: string) => set({ model }),
  setApiKey: (apiKey: string | null) => set({ apiKey: apiKey || '' })
}));
