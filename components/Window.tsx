'use client';

import { X, Minus, Maximize2, Terminal, Minimize2 } from 'lucide-react';
import type { WindowProps } from '@/types/window.types';
import { useRef, useState, useEffect } from 'react';
import { Draggable } from './Draggable';

export default function Window({ title, zIndex, children, isMaximized, isMinimized, onClose, onFocus, onMinimized, onMaximized }: WindowProps) {

  const [savedPos, setSavedPos] = useState({ x: 20, y: 20 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Initialize position to better fit mobile on mount, if desired
  useEffect(() => {
    // requestAnimationFrame avoids calling setState synchronously in the effect
    requestAnimationFrame(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setSavedPos({ x: 10, y: 10 });
      } else {
        setSavedPos({ x: 50 + Math.random() * 50, y: 50 + Math.random() * 50 }); // slight stagger
      }
    });
  }, []);

  if (isMinimized) return null;

  return (
    <div 
      onMouseDown={onFocus}
      ref={windowRef}
      style={{ 
        zIndex,
       transform: isMaximized ? 'translate(0px, 0px)' : `translate(${savedPos.x}px, ${savedPos.y}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        transition: isMaximized ? 'all 0.3s ease' : 'none'
      }}
     
      className={`absolute top-0 left-0 pointer-events-none transition-all duration-300 
        ${isMaximized ? 'w-full h-full p-0' : 'p-0'} 
      `}
    >
      <div className={`
        bg-black/95 border border-white/10 flex flex-col pointer-events-auto overflow-hidden 
        animate-in zoom-in-95 duration-200 ring-1 ring-white/5 
        ${isMaximized
          ? 'w-full h-full rounded-none border-none' 
          : 'w-[95vw] sm:w-[500px] md:w-[700px] lg:w-[800px] max-w-full h-[80vh] md:h-[600px] rounded-lg' 
        }
      `}>
        <Draggable 
        targetRef={windowRef}
        initialPos={savedPos}
        disabled={isMaximized}
        onDragEnd={(x, y) => setSavedPos({ x, y })}
        
          className="h-10 bg-zinc-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 select-none cursor-grab active:cursor-grabbing group"
        >
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onMouseDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); onMinimized(); }}
              className="p-1.5 rounded-md hover:bg-white/5 text-zinc-600 transition-colors"
            >
              <Minus size={14} />
            </button>
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onMaximized(); }}
              className="p-1.5 rounded-md hover:bg-white/5 text-zinc-600 transition-colors"
            >
              {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1.5 rounded-md hover:bg-red-500/20 text-zinc-600 hover:text-red-500 transition-all ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </Draggable>

        <div className="flex-1 overflow-auto bg-[#020202] custom-scrollbar">
          <div className="p-6 h-full">
            {children}
          </div>
        </div>

        <div className="h-6 bg-zinc-950 border-t border-white/5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Process: Active</span>
          </div>
          <span className="text-[9px] text-zinc-700 font-mono italic">Mem: 128MB_Uplink</span>
        </div>
      </div>
    </div>
  );
}