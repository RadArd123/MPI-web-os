import { create } from 'zustand';
import type { FileSystemState } from '@/types/explorer.types';



export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  items: [],
  currentFolderId: null,
  isLoading: false,

  setCurrentFolder: (id) => {
    set({ currentFolderId: id });
    get().fetchItems(id);
  },

  fetchItems: async (parentId) => {
    set({ isLoading: true });
    const res = await fetch(`/api/explorer?parentId=${parentId || ''}`);
    const data = await res.json();
    set({ items: data, isLoading: false });
  },

  createItem: async (name, type) => {
    const parentId = get().currentFolderId;
    const res = await fetch('/api/explorer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // <--- ASTA LIPSESSTE CEL MAI PROBABIL
      },
      body: JSON.stringify({ name, type, parentId }),
    });
    if (res.ok) get().fetchItems(parentId);
  },

  renameItem: async (id, newName) => {
    const res = await fetch(`/api/explorer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) get().fetchItems(get().currentFolderId);
  },

  deleteItem: async (id) => {
    const res = await fetch(`/api/explorer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) get().fetchItems(get().currentFolderId);
  },

  moveItem: async (id, newParentId) => {
    const res = await fetch(`/api/explorer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ parentId: newParentId }),
    });
    if (res.ok) get().fetchItems(get().currentFolderId);
  },

  updateContent: async (id, content) => {
    const res = await fetch(`/api/explorer/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {

        set((state) => ({
            items: state.items.map(item => item.id === id ? { ...item, content } : item)
        }));
    }
  },
}));