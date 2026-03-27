export interface FileItem {
  id: string;
  name: string;
  type: 'FILE' | 'FOLDER';
  parentId: string | null;
  content?: string;
}

export interface FileSystemState {
  items: FileItem[];
  currentFolderId: string | null;
  isLoading: boolean;
  
  setCurrentFolder: (id: string | null) => void;

  fetchItems: (parentId: string | null) => Promise<void>;
  createItem: (name: string, type: 'FILE' | 'FOLDER') => Promise<void>;
  renameItem: (id: string, newName: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  moveItem: (id: string, newParentId: string | null) => Promise<void>;
  updateContent: (id: string, content: string) => Promise<void>;
}