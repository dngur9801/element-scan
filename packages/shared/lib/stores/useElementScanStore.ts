import { create } from 'zustand';

interface useElementScanStore {
  elementScanActive: boolean;
  isPinned: boolean;
  hoveredElement: HTMLElement | null;
  elementInfo: {
    tagName: string;
    className: string;
    width: number;
    height: number;
    styles: {
      [key: string]: string;
    };
  };

  reset: () => void;
  toggleScan: (value?: boolean) => boolean;
  togglePin: (value?: boolean) => boolean;
  setHoveredElement: (element: HTMLElement | null) => void;
}

export const useElementScanStore = create<useElementScanStore>((set, get) => ({
  elementScanActive: false,
  isPinned: false,
  hoveredElement: null,
  elementInfo: {
    tagName: 'div',
    className: 'element-scan-store',
    width: 100,
    height: 100,
    styles: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red',
      border: '1px solid black',
      padding: '10px',
      margin: '10px',
    },
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
}));
