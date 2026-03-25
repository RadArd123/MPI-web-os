import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSnippetStore } from '@/store/snippetStore';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  useSnippetStore.setState({ snippets: [], isLoading: false, error: null });
  mockFetch.mockReset();
});

describe('useSnippetStore', () => {
  describe('fetchSnippets', () => {
    it('should populate snippets on successful fetch', async () => {
      const mockSnippets = [
        { id: '1', title: 'Hello', code: 'console.log("hi")' },
        { id: '2', title: 'World', code: 'console.log("world")' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnippets,
      });

      await useSnippetStore.getState().fetchSnippets('user-1');

      const state = useSnippetStore.getState();
      expect(state.snippets).toEqual(mockSnippets);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/snippets?userId=user-1');
    });

    it('should set error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await useSnippetStore.getState().fetchSnippets('user-1');

      const state = useSnippetStore.getState();
      expect(state.snippets).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeTruthy();
    });

    it('should set error on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await useSnippetStore.getState().fetchSnippets('user-1');

      const state = useSnippetStore.getState();
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading to true while fetching', async () => {
      let resolvePromise: Function;
      mockFetch.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const fetchPromise = useSnippetStore.getState().fetchSnippets('user-1');
      expect(useSnippetStore.getState().isLoading).toBe(true);

      resolvePromise!({ ok: true, json: async () => [] });
      await fetchPromise;

      expect(useSnippetStore.getState().isLoading).toBe(false);
    });
  });

  describe('addSnippet', () => {
    it('should prepend the new snippet to the list', async () => {
      useSnippetStore.setState({
        snippets: [{ id: '1', title: 'Existing', code: 'old' }],
      });

      const savedSnippet = { id: '2', title: 'New', code: 'new code' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => savedSnippet,
      });

      await useSnippetStore.getState().addSnippet(
        { title: 'New', code: 'new code' },
        'user-1'
      );

      const snippets = useSnippetStore.getState().snippets;
      expect(snippets).toHaveLength(2);
      expect(snippets[0].id).toBe('2'); // new one is first
      expect(snippets[1].id).toBe('1');
    });

    it('should not add snippet on failed request', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useSnippetStore.getState().addSnippet(
        { title: 'Fail', code: 'fail' },
        'user-1'
      );

      expect(useSnippetStore.getState().snippets).toHaveLength(0);
    });
  });

  describe('removeSnippet', () => {
    it('should remove the snippet by id on success', async () => {
      useSnippetStore.setState({
        snippets: [
          { id: '1', title: 'A', code: 'a' },
          { id: '2', title: 'B', code: 'b' },
        ],
      });

      mockFetch.mockResolvedValueOnce({ ok: true });

      await useSnippetStore.getState().removeSnippet('1', 'user-1');

      const snippets = useSnippetStore.getState().snippets;
      expect(snippets).toHaveLength(1);
      expect(snippets[0].id).toBe('2');
    });

    it('should not remove snippet on failed request', async () => {
      useSnippetStore.setState({
        snippets: [{ id: '1', title: 'A', code: 'a' }],
      });

      mockFetch.mockResolvedValueOnce({ ok: false });

      await useSnippetStore.getState().removeSnippet('1', 'user-1');

      expect(useSnippetStore.getState().snippets).toHaveLength(1);
    });
  });
});
