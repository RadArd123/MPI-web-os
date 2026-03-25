import { create } from 'zustand';
import type { SnippetState } from '@/types/snippet.types';

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: [],
  isLoading: false,
  error: null,

  fetchSnippets: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/snippets?userId=${userId}`);
      if (!res.ok) throw new Error("Nu am putut încărca datele.");
      const data = await res.json();
      set({ snippets: data });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      set({ isLoading: false });
    }
  },

  addSnippet: async (newData, userId) => {
    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newData, userId }),
      });
      if (res.ok) {
        const saved = await res.json();

        set({ snippets: [saved, ...get().snippets] });
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  },

  removeSnippet: async (id, userId) => {
    try {
      const res = await fetch(`/api/snippets?id=${id}&userId=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set({ snippets: get().snippets.filter(s => s.id !== id) });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }
}));