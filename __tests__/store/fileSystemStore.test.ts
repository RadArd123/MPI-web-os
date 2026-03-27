import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFileSystemStore } from '@/store/usefileSystemStore';
import { FileItem } from '@/types/explorer.types';

// Înlocuim funcția "fetch" reală a browserului cu un "spion" (mock) pus la dispoziție de Vitest
global.fetch = vi.fn();

describe('FileSystem Store', () => {
  
  // Înainte de fiecare test, resetez baza de stare locală la setările de fabrică. 
  // Așa previn "murdărirea" testelor unele de altele
  beforeEach(() => {
    // Resetăm doar datele (lăsăm funcțiile din store intacte)
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

    // Când store-ul face fetch(), noi dăm instant un răspuns virtual de "OK" (status 200) și returnăm Json-ul mock-uit
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const store = useFileSystemStore.getState();
    // Apelăm metoda de Store
    store.setCurrentFolder('dir-1');

    // Funcția fetchItems de susună rulează "în fundal", așa că trebuie să lăsăm o zecime de secundă pentru rezoluția Fetch-ului
    await new Promise((r) => setTimeout(r, 10));

    // Luăm store-ul din nou ca să testăm ce a băgat efectiv în "items"
    const stareaNoua = useFileSystemStore.getState();
    
    expect(stareaNoua.currentFolderId).toBe('dir-1');
    expect(stareaNoua.items).toEqual(mockData);
    expect(stareaNoua.isLoading).toBe(false); // După ce s-a terminat, loading trebuie să fie fals
    
    // Validăm URL-ul la care s-a strigat ca să ne asigurăm că a atașat parentId ca query string
    expect(global.fetch).toHaveBeenCalledWith('/api/explorer?parentId=dir-1');
  });

  it('trebuie să facă POST către API la `createItem`', async () => {
    // Punem din memorie folder-ul curent în context
    useFileSystemStore.setState({ currentFolderId: 'folderX' });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ([]),
    });

    await useFileSystemStore.getState().createItem('Raport.pdf', 'FILE');

    // Testăm dacă a strigat adresa de creere a fisierului
    expect(global.fetch).toHaveBeenCalledWith('/api/explorer', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Verificăm dacă body-ul generat a lipit automat noul obiect de parentId-ul activ la acel moment
      body: JSON.stringify({ name: 'Raport.pdf', type: 'FILE', parentId: 'folderX' }),
    }));
  });
});
