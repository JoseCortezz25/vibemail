import { create } from 'zustand';

interface EmailStore {
  subject: string;
  jsxBody: string;
  htmlBody: string;
  isLoading: boolean;
  setEmail: (
    payload: Pick<EmailStore, 'subject' | 'jsxBody' | 'htmlBody'>
  ) => void;
  setHtmlBody: (htmlBody: string) => void;
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
  setHtmlBody: (htmlBody: string) => set({ htmlBody }),
  resetEmail: () =>
    set({ subject: '', jsxBody: '', htmlBody: '', isLoading: false }),
  setIsLoading: (isLoading: boolean) => set({ isLoading })
}));
