import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFileSystemStore } from '@/store/usefileSystemStore';
import { FileItem } from '@/types/explorer.types';


global.fetch = vi.fn();

describe('FileSystem Store', () => {



  beforeEach(() => {

    useFileSystemStore.setState({
      items: [],
      currentFolderId: null,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('ar trebui să aibă starea inițială corectă', () => {
    const stareaCurenta = useFileSystemStore.getState();
    expect(stareaCurenta.items).toHaveLength(0);
    expect(stareaCurenta.currentFolderId).toBeNull();
    expect(stareaCurenta.isLoading).toBe(false);
  });

  it('trebuie să preia datele de la server corect la setCurrentFolder', async () => {
    const mockData: FileItem[] = [
      { id: 'fisier1', name: 'Plan', type: 'FILE', parentId: 'dir-1' }
    ];


    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const store = useFileSystemStore.getState();

    store.setCurrentFolder('dir-1');


    await new Promise((r) => setTimeout(r, 10));


    const stareaNoua = useFileSystemStore.getState();

    expect(stareaNoua.currentFolderId).toBe('dir-1');
    expect(stareaNoua.items).toEqual(mockData);
    expect(stareaNoua.isLoading).toBe(false);

    expect(global.fetch).toHaveBeenCalledWith('/api/explorer?parentId=dir-1');
  });

  it('trebuie să facă POST către API la `createItem`', async () => {

    useFileSystemStore.setState({ currentFolderId: 'folderX' });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ([]),
    });

    await useFileSystemStore.getState().createItem('Raport.pdf', 'FILE');


    expect(global.fetch).toHaveBeenCalledWith('/api/explorer', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ name: 'Raport.pdf', type: 'FILE', parentId: 'folderX' }),
    }));
  });
});
