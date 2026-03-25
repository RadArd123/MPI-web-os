import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from '@/store/useWindowStore';

// Reset the store before each test
beforeEach(() => {
  useWindowStore.setState({ windows: [], activeWindowId: null });
});

describe('useWindowStore', () => {
  describe('openWindow', () => {
    it('should create a new window with correct defaults', () => {
      useWindowStore.getState().openWindow('terminal', 'Terminal');

      const { windows, activeWindowId } = useWindowStore.getState();
      expect(windows).toHaveLength(1);
      expect(windows[0]).toMatchObject({
        id: 'terminal',
        title: 'Terminal',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
      });
      expect(activeWindowId).toBe('terminal');
    });

    it('should not create a duplicate window — focuses instead', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('terminal', 'Terminal');
      openWindow('browser', 'Browser');
      openWindow('terminal', 'Terminal'); // duplicate

      const { windows, activeWindowId } = useWindowStore.getState();
      expect(windows).toHaveLength(2);
      expect(activeWindowId).toBe('terminal');
    });

    it('should assign incrementing zIndex values', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('a', 'A');
      openWindow('b', 'B');

      const { windows } = useWindowStore.getState();
      expect(windows[1].zIndex).toBeGreaterThan(windows[0].zIndex);
    });
  });

  describe('closeWindow', () => {
    it('should remove the window from the list', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('terminal', 'Terminal');
      useWindowStore.getState().closeWindow('terminal');

      expect(useWindowStore.getState().windows).toHaveLength(0);
    });

    it('should clear activeWindowId if the active window is closed', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('terminal', 'Terminal');
      useWindowStore.getState().closeWindow('terminal');

      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });

    it('should keep activeWindowId if a different window is closed', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('terminal', 'Terminal');
      openWindow('browser', 'Browser');
      useWindowStore.getState().closeWindow('terminal');

      expect(useWindowStore.getState().activeWindowId).toBe('browser');
    });
  });

  describe('focusWindow', () => {
    it('should raise the zIndex of the focused window', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('a', 'A');
      openWindow('b', 'B');

      useWindowStore.getState().focusWindow('a');

      const { windows } = useWindowStore.getState();
      const windowA = windows.find(w => w.id === 'a')!;
      const windowB = windows.find(w => w.id === 'b')!;
      expect(windowA.zIndex).toBeGreaterThan(windowB.zIndex);
    });

    it('should un-minimize a minimized window when focused', () => {
      useWindowStore.getState().openWindow('a', 'A');
      useWindowStore.getState().toggleMinimize('a');
      expect(useWindowStore.getState().windows[0].isMinimized).toBe(true);

      useWindowStore.getState().focusWindow('a');
      expect(useWindowStore.getState().windows[0].isMinimized).toBe(false);
    });

    it('should set activeWindowId', () => {
      const { openWindow } = useWindowStore.getState();
      openWindow('a', 'A');
      openWindow('b', 'B');

      useWindowStore.getState().focusWindow('a');
      expect(useWindowStore.getState().activeWindowId).toBe('a');
    });
  });

  describe('toggleMinimize', () => {
    it('should toggle isMinimized', () => {
      useWindowStore.getState().openWindow('a', 'A');

      useWindowStore.getState().toggleMinimize('a');
      expect(useWindowStore.getState().windows[0].isMinimized).toBe(true);

      useWindowStore.getState().toggleMinimize('a');
      expect(useWindowStore.getState().windows[0].isMinimized).toBe(false);
    });

    it('should clear activeWindowId when minimizing the active window', () => {
      useWindowStore.getState().openWindow('a', 'A');
      expect(useWindowStore.getState().activeWindowId).toBe('a');

      useWindowStore.getState().toggleMinimize('a');
      expect(useWindowStore.getState().activeWindowId).toBeNull();
    });
  });

  describe('toggleMaximize', () => {
    it('should toggle isMaximized', () => {
      useWindowStore.getState().openWindow('a', 'A');

      useWindowStore.getState().toggleMaximize('a');
      expect(useWindowStore.getState().windows[0].isMaximized).toBe(true);

      useWindowStore.getState().toggleMaximize('a');
      expect(useWindowStore.getState().windows[0].isMaximized).toBe(false);
    });

    it('should un-minimize when maximizing', () => {
      useWindowStore.getState().openWindow('a', 'A');
      useWindowStore.getState().toggleMinimize('a');
      useWindowStore.getState().toggleMaximize('a');

      const win = useWindowStore.getState().windows[0];
      expect(win.isMaximized).toBe(true);
      expect(win.isMinimized).toBe(false);
    });

    it('should set activeWindowId to the maximized window', () => {
      useWindowStore.getState().openWindow('a', 'A');
      useWindowStore.getState().openWindow('b', 'B');

      useWindowStore.getState().toggleMaximize('a');
      expect(useWindowStore.getState().activeWindowId).toBe('a');
    });
  });
});
