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

export interface VisualEditState {
  // Selected element state
  selectedElementId: string | null;
  selectedElementType: ElementType | null;
  selectedElementProperties: ElementProperties | null;

  // Edit mode
  isEditMode: boolean;
  editSource: 'visual' | 'ai' | null;

  // Actions
  selectElement: (
    id: string,
    type: ElementType,
    properties: ElementProperties
  ) => void;
  deselectElement: () => void;
  updateElementProperty: (key: string, value: unknown) => void;
  setEditMode: (enabled: boolean) => void;
  setEditSource: (source: 'visual' | 'ai' | null) => void;
  reset: () => void;
}

const initialState = {
  selectedElementId: null,
  selectedElementType: null,
  selectedElementProperties: null,
  isEditMode: false,
  editSource: null
};

export const useVisualEditStore = create<VisualEditState>(set => ({
  ...initialState,

  selectElement: (id, type, properties) => {
    set({
      selectedElementId: id,
      selectedElementType: type,
      selectedElementProperties: properties,
      isEditMode: true
    });
  },

  deselectElement: () => {
    set({
      selectedElementId: null,
      selectedElementType: null,
      selectedElementProperties: null,
      isEditMode: false,
      editSource: null
    });
  },

  updateElementProperty: (key, value) => {
    set(state => ({
      selectedElementProperties: state.selectedElementProperties
        ? {
            ...state.selectedElementProperties,
            [key]: value
          }
        : null
    }));
  },

  setEditMode: enabled => {
    set({ isEditMode: enabled });
    if (!enabled) {
      set({
        selectedElementId: null,
        selectedElementType: null,
        selectedElementProperties: null,
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
