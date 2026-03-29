import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfileStore } from '@/store/profileStore';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  useProfileStore.setState({ profiles: [], profile: null, isLoading: false, error: null });
  mockFetch.mockReset();
});

describe('useProfileStore', () => {
  describe('fetchProfiles', () => {
    it('should populate profiles on successful fetch', async () => {
      const mockProfiles = [
        { id: '1', userId: 'user1', operatorName: 'Alice', themeColor: 'red' },
        { id: '2', userId: 'user2', operatorName: 'Bob', themeColor: 'blue' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfiles,
      });

      await useProfileStore.getState().fetchProfiles();

      const state = useProfileStore.getState();
      expect(state.profiles).toEqual(mockProfiles);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.any(Object));
    });

    it('should set error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useProfileStore.getState().fetchProfiles();

      const state = useProfileStore.getState();
      expect(state.profiles).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeTruthy();
    });
  });

  describe('updateProfile', () => {
    it('should update profile on success', async () => {
      useProfileStore.setState({
        profiles: [{ id: '1', userId: 'user1', operatorName: 'Alice', themeColor: 'red' }],
      });

      const updatedProfile = { id: '1', userId: 'user1', operatorName: 'Alice2', themeColor: 'blue' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProfile,
      });

      await useProfileStore.getState().updateProfile('user1', 'Alice2', 'blue');

      const state = useProfileStore.getState();
      expect(state.profile).toEqual(updatedProfile);
      expect(state.profiles[0]).toEqual(updatedProfile);
      expect(state.isLoading).toBe(false);
    });

    it('should not update profile on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useProfileStore.getState().updateProfile('user1', 'Alice2', 'blue');

      const state = useProfileStore.getState();
      expect(state.profile).toBeNull();
      expect(state.error).toBeTruthy();
    });
  });

  describe('getProfile', () => {
    it('should fetch single profile on success', async () => {
      const mockProfile = { id: '1', userId: 'user1', operatorName: 'Alice', themeColor: 'red' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      await useProfileStore.getState().getProfile('user1');

      const state = useProfileStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/profile/user1', expect.any(Object));
    });

    it('should set error on profile fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useProfileStore.getState().getProfile('user1');

      const state = useProfileStore.getState();
      expect(state.profile).toBeNull();
      expect(state.error).toBeTruthy();
    });
  });

  describe('getProfileByOperatorName', () => {
    it('should fetch profile by operator name on success', async () => {
      const mockProfile = { id: '1', userId: 'user1', operatorName: 'Alice', themeColor: 'red' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      await useProfileStore.getState().getProfileByOperatorName('Alice');

      const state = useProfileStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.objectContaining({ method: 'POST' }));
    });

    it('should set error on fetch failure by operator name', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useProfileStore.getState().getProfileByOperatorName('Alice');

      const state = useProfileStore.getState();
      expect(state.profile).toBeNull();
      expect(state.error).toBeTruthy();
    });
  });
});
