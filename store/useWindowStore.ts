import type { WindowInstance, WindowState } from '@/types/window.types';
import { create } from 'zustand';



export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (id, title) => {
    const { windows } = get();
   
    if (windows.find(w => w.id === id)) {
      get().focusWindow(id);
      return;
    }

  
    const newWindow: WindowInstance = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 10, 
    };

    set({ 
      windows: [...windows, newWindow],
      activeWindowId: id 
    });
  },

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  focusWindow: (id) => {
    const { windows } = get();
    const maxZ = Math.max(...windows.map(w => w.zIndex), 10);
    
    set({
      windows: windows.map(w => 
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      ),
      activeWindowId: id
    });
  },
  toggleMinimize: (id) => {
  set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ),
   
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  }));
},
toggleMaximize: (id) => {
  set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w
    ),
    activeWindowId: id,
  }));
},
}));