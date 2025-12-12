import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const FREE_LIMIT = 10;

export interface GeneratedEmail {
  subject: string;
  createdAt: string;
}

interface FreeUsageStore {
  freeLimit: number;
  generatedEmails: GeneratedEmail[];
  registerEmail: (subject: string) => void;
  emailExists: (subject: string) => boolean;
}

export const useFreeUsageStore = create<FreeUsageStore>()(
  persist(
    (set, get) => ({
      freeLimit: FREE_LIMIT,
      generatedEmails: [],

      emailExists: (subject: string) => {
        const { generatedEmails } = get();
        return generatedEmails.some(email => email.subject === subject);
      },

      registerEmail: (subject: string) => {
        const { generatedEmails, freeLimit, emailExists } = get();

        // If email already exists, don't count it again
        if (emailExists(subject)) {
          return;
        }

        if (generatedEmails.length >= freeLimit) {
          throw new Error('Free limit reached');
        }

        const newEmail: GeneratedEmail = {
          subject,
          createdAt: new Date().toISOString()
        };

        const updatedEmails = [...generatedEmails, newEmail];
        set({ generatedEmails: updatedEmails });
      }
    }),
    {
      name: 'free-usage-emails'
    }
  )
);

// Selector para obtener el número de emails usados
export const selectFreeUsed = (state: FreeUsageStore) =>
  state.generatedEmails.length;
