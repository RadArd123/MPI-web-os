import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileSystemService } from '@/lib/service/fileSystem.service';
import { prisma } from '@/lib/prisma';
import { ItemType } from '@/generated/prisma';

// 1. Facem mock la Prisma Client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    fileSystemItem: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('FileSystem Service Tests', () => {
  const mockUserId = 'user-123';
  
  beforeEach(() => {
    // Resetăm de fiecare dată starea mock-urilor înainte de un test nou
    vi.clearAllMocks();
  });

  it('ar trebui să obțină conținutul unui folder (getFolderContent)', async () => {
    const mockFiles = [
      { id: '1', name: 'Raport', type: 'FILE', parentId: null, userId: mockUserId },
      { id: '2', name: 'Documente', type: 'FOLDER', parentId: null, userId: mockUserId }
    ];

    // Învățăm mock-ul Prisma ce să returneze
    (prisma.fileSystemItem.findMany as any).mockResolvedValue(mockFiles);

    const result = await fileSystemService.getFolderContent(mockUserId, null);

    expect(prisma.fileSystemItem.findMany).toHaveBeenCalledWith({
      where: { userId: mockUserId, parentId: null },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    
    expect(result).toHaveLength(2);
    expect(result).toEqual(mockFiles);
  });

  it('ar trebui să creeze un item doar dacă nu există un duplicat', async () => {
    // Cazul 1: Fără duplicat -> Se creează cu succes
    (prisma.fileSystemItem.findFirst as any).mockResolvedValue(null);
    const mockCreated = { id: '123', name: 'Nou', type: 'FILE' as ItemType };
    (prisma.fileSystemItem.create as any).mockResolvedValue(mockCreated);

    const result = await fileSystemService.createItem(mockUserId, {
      name: 'Nou',
      type: 'FILE' as ItemType,
      parentId: null
    });

    expect(result).toEqual(mockCreated);
    expect(prisma.fileSystemItem.create).toHaveBeenCalled();

    // Cazul 2: Când există duplicat -> Aruncă eroare
    (prisma.fileSystemItem.findFirst as any).mockResolvedValue({ id: 'existing' });
    
    await expect(
        fileSystemService.createItem(mockUserId, { name: 'Nou', type: 'FILE' as ItemType, parentId: null })
    ).rejects.toThrow("Item with this name already exists in the parent folder");
  });
});
