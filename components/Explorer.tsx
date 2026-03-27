'use client';

import React, { useEffect, useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2,
  HardDrive
} from 'lucide-react';
import { useFileSystemStore } from '@/store/usefileSystemStore';

export const Explorer = () => {
  const { 
    items, 
    currentFolderId, 
    isLoading, 
    setCurrentFolder, 
    fetchItems, 
    createItem, 
    deleteItem, 
    renameItem,
    updateContent
  } = useFileSystemStore();

  const [newItemName, setNewItemName] = useState('');
  const [editingFile, setEditingFile] = useState<{ id: string, name: string, content: string } | null>(null);

  // Încărcare inițială
  useEffect(() => {
    fetchItems(currentFolderId);
  }, [currentFolderId, fetchItems]);

  const handleCreate = async (type: 'FOLDER' | 'FILE') => {
    const name = newItemName.trim() || (type === 'FOLDER' ? 'New_Sector' : 'New_Data');
    await createItem(name, type);
    setNewItemName('');
  };

  const handleRename = (id: string, oldName: string) => {
    const newName = prompt('Redenumește:', oldName);
    if (newName && newName !== oldName) {
      renameItem(id, newName);
    }
  };

  const handleSaveContent = async () => {
    if (!editingFile) return;
    await updateContent(editingFile.id, editingFile.content);
    setEditingFile(null);
  };

  return (
    <div className="flex flex-col h-full text-zinc-300 font-mono text-sm">
      
      {/* Toolbar - Acțiuni și Navigare */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 gap-4">
        {editingFile ? (
          <>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setEditingFile(null)}
                className="p-1.5 hover:bg-white/10 rounded-md text-cyan-400 transition-colors"
                title="Înapoi"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/10">
                <File size={14} className="text-zinc-500" />
                <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
                  {editingFile.name}
                </span>
              </div>
            </div>
            <button 
              onClick={handleSaveContent}
              className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded border border-cyan-500/50 text-xs transition-colors tracking-widest"
            >
              SALVEAZĂ
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              {currentFolderId && (
                <button 
                  onClick={() => setCurrentFolder(null)} // Reset la root
                  className="p-1.5 hover:bg-white/10 rounded-md text-cyan-400 transition-colors"
                  title="Înapoi la Root"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/10">
                <HardDrive size={14} className="text-zinc-500" />
                <span className="text-[10px] uppercase tracking-tighter text-zinc-500">
                  {currentFolderId ? `root / ${currentFolderId}` : 'root'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nume..."
                className="bg-black border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500/50 w-32"
              />
              <button 
                onClick={() => handleCreate('FOLDER')}
                className="p-1.5 hover:bg-cyan-500/20 hover:text-cyan-400 rounded border border-white/10 transition-all"
                title="Folder Nou"
              >
                <Folder size={16} />
              </button>
              <button 
                onClick={() => handleCreate('FILE')}
                className="p-1.5 hover:bg-purple-500/20 hover:text-purple-400 rounded border border-white/10 transition-all"
                title="Fișier Nou"
              >
                <File size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Listă Fișiere sau Editor */}
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        {editingFile ? (
          <textarea
            value={editingFile.content}
            onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
            className="w-full h-full bg-black/50 text-emerald-400 font-mono text-sm p-4 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/30 resize-none transition-colors"
            placeholder="// Introducere date..."
            spellCheck={false}
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-[10px] tracking-widest">SYNCING...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center h-full border border-dashed border-white/5 rounded-lg opacity-30">
            <span>Sector gol</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase border-b border-white/5">
                <th className="pb-2 font-medium">Nume</th>
                <th className="pb-2 font-medium">Tip</th>
                <th className="pb-2 font-medium text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr 
                  key={item.id}
                  onDoubleClick={() => {
                    if (item.type === 'FOLDER') {
                      setCurrentFolder(item.id);
                    } else {
                      setEditingFile({ id: item.id, name: item.name, content: item.content || '' });
                    }
                  }}
                  className="group hover:bg-white/5 cursor-default transition-colors"
                >
                  <td className="py-2 flex items-center gap-3">
                    {item.type === 'FOLDER' ? (
                      <Folder size={16} className="text-cyan-400" />
                    ) : (
                      <File size={16} className="text-purple-400" />
                    )}
                    <span className="truncate max-w-[200px] group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="py-2 text-[10px] text-zinc-600">
                    {item.type}
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleRename(item.id, item.name)}
                        className="p-1 hover:text-cyan-400 text-zinc-600"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-1 hover:text-red-400 text-zinc-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-600 uppercase">
        <span>{items.length} obiecte detectate</span>
        <span>Sistem: File_System_v1</span>
      </div>
    </div>
  );
};