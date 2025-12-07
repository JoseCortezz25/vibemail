import { create } from 'zustand';

export type ElementType = 'text' | 'image' | 'button' | 'container' | 'link';

export interface ElementProperties {
  // Common properties
  content?: string;
  tagName?: string;

  // Style properties
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;

  // Image-specific
  src?: string;
  alt?: string;

  // Link-specific
  href?: string;
  target?: string;

  // Generic attributes
  [key: string]: unknown;
}

export interface SelectedElement {
  id: string;
  type: ElementType;
  properties: ElementProperties;
  code: string;
}

export interface VisualEditState {
  // Selected element state (grouped)
  selectedElement: SelectedElement | null;

  // Edit mode
  isEditMode: boolean;
  editSource: 'visual' | 'ai' | null;

  // Actions
  selectElement: (element: SelectedElement) => void;
  deselectElement: () => void;
  updateElementProperty: (key: string, value: unknown) => void;
  setEditMode: (enabled: boolean) => void;
  setEditSource: (source: 'visual' | 'ai' | null) => void;
  reset: () => void;
}

const initialState = {
  selectedElement: null,
  isEditMode: false,
  editSource: null
};

export const useVisualEditStore = create<VisualEditState>(set => ({
  ...initialState,

  selectElement: element => {
    set({
      selectedElement: element,
      isEditMode: true
    });
  },

  deselectElement: () => {
    set({
      selectedElement: null,
      isEditMode: false,
      editSource: null
    });
  },

  updateElementProperty: (key, value) => {
    set(state => ({
      selectedElement: state.selectedElement
        ? {
            ...state.selectedElement,
            properties: {
              ...state.selectedElement.properties,
              [key]: value
            }
          }
        : null
    }));
  },

  setEditMode: enabled => {
    set({ isEditMode: enabled });
    if (!enabled) {
      set({
        selectedElement: null,
        editSource: null
      });
    }
  },

  setEditSource: source => {
    set({ editSource: source });
  },

  reset: () => {
    set(initialState);
  }
}));
