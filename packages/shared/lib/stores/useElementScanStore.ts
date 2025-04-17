import { create } from 'zustand';

interface useElementScanStore {
  elementScanActive: boolean;
  isPinned: boolean;
  hoveredElement: HTMLElement | null;

  reset: () => void;
  toggleScan: (value?: boolean) => boolean;
  togglePin: (value?: boolean) => boolean;
  setHoveredElement: (element: HTMLElement | null) => void;
}

export const useElementScanStore = create<useElementScanStore>((set, get) => ({
  elementScanActive: false,
  isPinned: false,
  hoveredElement: null,

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
}));
