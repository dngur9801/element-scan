import { create } from 'zustand';
import { type ElementInfo } from '../types/index.js';

interface useElementScanStore {
  elementScanActive: boolean;
  isPinned: boolean;
  hoveredElement: HTMLElement | null;
  elementInfo: ElementInfo | null;

  reset: () => void;
  toggleScan: (value?: boolean) => boolean;
  togglePin: (value?: boolean) => boolean;
  setHoveredElement: (element: HTMLElement | null) => void;
  setElementInfo: (elementInfo: ElementInfo | null) => void;
}

export const useElementScanStore = create<useElementScanStore>((set, get) => ({
  elementScanActive: false,
  isPinned: false,
  hoveredElement: null,
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

  setHoveredElement: (element: HTMLElement | null) => set({ hoveredElement: element }),

  setElementInfo: (elementInfo: ElementInfo | null) => set({ elementInfo }),
}));
