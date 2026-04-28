'use client';

import { useState, useEffect } from 'react';
import { Save, Trash2, X, Copy } from 'lucide-react';
import { useSnippetStore } from '@/store/snippetStore';
import { useAuthStore } from '@/store/authStore';
import type { Snippet } from '@/types/snippet.types';

export default function CaptainsLog() {
  const { snippets, fetchSnippets, addSnippet, removeSnippet, isLoading } = useSnippetStore();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  
  const { user } = useAuthStore();
   
  useEffect(() => {
    if (!user?.id) return;
    fetchSnippets(user?.id);
  }, [fetchSnippets, user?.id]);

  const handleSave = async () => {
    if (!title || !code) return;
    if (!user?.id) {
      alert("User not authenticated!");
      return;
    }
    await addSnippet({ title, code }, user?.id);
    setTitle('');
    setCode('');
  };

  return (
    <div className="flex flex-col h-full gap-4 text-zinc-100 text-sm relative">
 
      <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Snippet Title..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-b border-white/10 py-1 focus:outline-none focus:border-white/40 transition-colors"
        />
        <textarea 
          placeholder="Type your stellar code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-black/40 p-2 rounded h-32 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-white/40"
        />
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black py-2 rounded transition-all font-bold uppercase tracking-tighter text-[10px]"
        >
          <Save size={14} /> Encrypt & Save to Neon
        </button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col gap-2 custom-scrollbar">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">Stored Logs</h3>
        {isLoading ? <p className="animate-pulse">Accessing Database...</p> : 
          snippets.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSnippet(s)} 
              className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/30 transition-all flex justify-between items-start cursor-pointer"
            >
              <div className="flex-1">
                <p className="font-bold text-zinc-200 text-xs">{s.title}</p>
                <code className="text-[10px] text-zinc-400 line-clamp-1">{s.code}</code>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (user?.id) removeSnippet(s.id, user.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        }
      </div>

      {selectedSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 ">
          <div className="bg-zinc-900 border border-white/20 w-full max-w-2xl max-h-[80vh] rounded-lg shadow-2xl flex flex-col">
          
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-zinc-100 font-bold uppercase tracking-widest text-xs">{selectedSnippet.title}</h2>
              <button 
                onClick={() => setSelectedSnippet(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
        
            <div className="p-6 overflow-auto custom-scrollbar bg-black/20">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap break-all leading-relaxed">
                {selectedSnippet.code}
              </pre>
            </div>

       
            <div className="p-3 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(selectedSnippet.code);
                 
                }}
                className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                <Copy size={12} /> Copy Code
              </button>
              <button 
                onClick={() => setSelectedSnippet(null)}
                className="text-[10px] uppercase font-bold text-zinc-500 hover:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
