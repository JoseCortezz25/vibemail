import { create } from 'zustand';

interface EmailStore {
  subject: string;
  jsxBody: string;
  htmlBody: string;
  isLoading: boolean;
  setEmail: (
    payload: Pick<EmailStore, 'subject' | 'jsxBody' | 'htmlBody'>
  ) => void;
  resetEmail: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useEmailStore = create<EmailStore>(set => ({
  subject: '',
  jsxBody: '',
  htmlBody: '',
  isLoading: false,
  setEmail: (payload: Pick<EmailStore, 'subject' | 'jsxBody' | 'htmlBody'>) =>
    set({ ...payload }),
  resetEmail: () =>
    set({ subject: '', jsxBody: '', htmlBody: '', isLoading: false }),
  setIsLoading: (isLoading: boolean) => set({ isLoading })
}));
