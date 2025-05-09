import { create } from 'zustand';
import { type ElementInfo, type ElementType } from '../types/index.js';

interface useElementScanStore {
  elementScanActive: boolean;
  isPinned: boolean;
  hoveredElement: ElementType | null;
  selectedElement: ElementType | null;
  isButtonVisible: boolean;
  elementInfo: ElementInfo | null;

  reset: () => void;
  toggleScan: (value?: boolean) => boolean;
  togglePin: (value?: boolean) => boolean;
  toggleElementScanButtonVisible: (value?: boolean) => boolean;
  setHoveredElement: (element: ElementType | null) => void;
  setSelectedElement: (element: ElementType | null) => void;
  setElementInfo: (elementInfo: ElementInfo | null) => void;
  updateElementStyle: (groupName: string, property: string, value: string) => void;
}

export const useElementScanStore = create<useElementScanStore>((set, get) => ({
  elementScanActive: false,
  isPinned: false,
  hoveredElement: null,
  selectedElement: null,
  isButtonVisible: false,
  elementInfo: {
    tagName: '',
    className: '',
    width: 0,
    height: 0,
    styleGroups: [],
  },

  reset: () =>
    set({
      elementScanActive: false,
      isPinned: false,
      hoveredElement: null,
      selectedElement: null,
    }),

  toggleScan: (value?: boolean) => {
    const current = get().elementScanActive;
    const isActive = value !== undefined ? value : !current;

    if (isActive) {
      set({
        elementScanActive: isActive,
      });
    } else {
      get().reset();
    }

    return isActive;
  },

  togglePin: (value?: boolean) => {
    const current = get().isPinned;
    const isPinned = value !== undefined ? value : !current;
    set({ isPinned });
    return isPinned;
  },

  toggleElementScanButtonVisible: (value?: boolean) => {
    const current = get().isButtonVisible;
    const isButtonVisible = value !== undefined ? value : !current;
    set({ isButtonVisible });
    return isButtonVisible;
  },

  setHoveredElement: (element: ElementType | null) => set({ hoveredElement: element }),

  setSelectedElement: (element: ElementType | null) => set({ selectedElement: element }),

  setElementInfo: (elementInfo: ElementInfo | null) => set({ elementInfo }),

  updateElementStyle: (groupName: string, property: string, value: string) => {
    const elementInfo = get().elementInfo;
    if (!elementInfo) return;

    const updatedStyleGroups = elementInfo.styleGroups.map(group => {
      if (group.name === groupName) {
        return {
          ...group,
          styles: {
            ...group.styles,
            [property]: value,
          },
        };
      }
      return group;
    });

    set({
      elementInfo: {
        ...elementInfo,
        styleGroups: updatedStyleGroups,
      },
    });
  },
}));
