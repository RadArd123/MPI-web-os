import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/store/authStore';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock window.location for logout
const mockLocation = { href: '' };
Object.defineProperty(globalThis, 'window', {
  value: { location: mockLocation },
  writable: true,
});

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  mockFetch.mockReset();
  mockLocation.href = '';
});

const mockUser = { id: '1', email: 'test@test.com', operatorName: 'Pilot' };

describe('useAuthStore', () => {
  describe('setSession', () => {
    it('should set user and mark as authenticated', () => {
      useAuthStore.getState().setSession(mockUser as any);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should clear auth when setting null', () => {
      useAuthStore.getState().setSession(mockUser as any);
      useAuthStore.getState().setSession(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('checkSession', () => {
    it('should populate user on successful session check', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      await useAuthStore.getState().checkSession();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user on failed session check', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useAuthStore.getState().checkSession();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Offline'));

      await useAuthStore.getState().checkSession();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should return success and set user on valid login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      const result = await useAuthStore.getState().login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({ success: true, user: mockUser });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should return error on invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'INVALID_CREDENTIALS' }),
      });

      const result = await useAuthStore.getState().login({
        email: 'bad@test.com',
        password: 'wrong',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('INVALID_CREDENTIALS');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should return connection error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Offline'));

      const result = await useAuthStore.getState().login({
        email: 'a@b.com',
        password: 'x',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('SYSTEM_FAILURE_CONNECTION_LOST');
    });
  });

  describe('signup', () => {
    it('should return success on valid signup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      const result = await useAuthStore.getState().signup({
        email: 'new@test.com',
        password: 'pass',
        operatorName: 'Newbie',
      });

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should return error on failed signup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'User already exists' }),
      });

      const result = await useAuthStore.getState().signup({
        email: 'dup@test.com',
        password: 'pass',
        operatorName: 'Dup',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User already exists');
    });

    it('should return core process failure on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Offline'));

      const result = await useAuthStore.getState().signup({
        email: 'a@b.com',
        password: 'x',
        operatorName: 'Y',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('CORE_PROCESS_FAILURE');
    });
  });

  describe('logout', () => {
    it('should clear auth state and redirect to login', async () => {
      useAuthStore.setState({ user: mockUser as any, isAuthenticated: true });

      mockFetch.mockResolvedValueOnce({ ok: true });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(mockLocation.href).toBe('/login');
    });
  });
});
