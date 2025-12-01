import { create } from 'zustand';

export type ViewType = 'chat' | 'preview';

interface UIStore {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  toggleView: () => void;
}

export const useUIStore = create<UIStore>(set => ({
  activeView: 'chat',
  setActiveView: (view: ViewType) => set({ activeView: view }),
  toggleView: () =>
    set(state => ({
      activeView: state.activeView === 'chat' ? 'preview' : 'chat'
    }))
}));
