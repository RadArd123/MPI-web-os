"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Terminal,
  Gamepad2,
  Settings,
  FolderClosed,
  Activity,
  LucideIcon,
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";

const ICON_MAP: Record<string, LucideIcon> = {
  "captains-log": Terminal,
  arcade: Gamepad2,
  files: FolderClosed,
  monitor: Activity,
  settings: Settings,
};

export default function Sidebar({ onLogout, name }: { onLogout: () => void; name: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { windows, activeWindowId, focusWindow, toggleMinimize } =
    useWindowStore();

  return (
    <aside
      className={`relative z-50 flex md:flex-col bg-black/60 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] md:shadow-none backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-800 transition-all duration-300 ${
        isSidebarOpen ? "w-full max-h-[45vh] md:max-h-none md:h-full md:w-64 flex-col" : "w-full h-16 md:w-40 md:h-full flex-row md:flex-col"
      }`}
    >

      <div className={`h-16 flex items-center justify-between px-4 border-b border-gray-800 shrink-0 relative w-full`}>
        <div className="flex items-center gap-3 overflow-hidden w-full">
          <div className="w-8 h-8 px-6 rounded border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-bold text-[12px] shrink-0">
            {name}
          </div>
          <div className={`flex flex-col truncate`}>
           
            <span className="text-[9px] text-gray-500 uppercase tracking-widest hidden md:block">OPERATOR</span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-400 absolute right-4 md:right-[-12px] top-5 z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={14} className="rotate-90 md:rotate-0" />
          ) : (
            <ChevronRight size={14} className="-rotate-90 md:rotate-0" />
          )}
        </button>
      </div>

      {/* Dynamic Process List */}
      <div className={`flex-1 py-3 md:py-6 flex gap-2 px-3 custom-scrollbar ${isSidebarOpen ? "flex-col overflow-y-auto" : "flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto items-center md:items-stretch"}`}>
        {windows.length > 0 && (
          <p
            className={`text-[9px] font-bold text-zinc-600 md:mb-2 px-2 tracking-widest shrink-0 ${!isSidebarOpen && "md:text-center hidden md:block"}`}
          >
            {isSidebarOpen ? "ACTIVE_PROCESSES" : "PROC"}
          </p>
        )}

        {windows.map((win) => {
          const Icon = ICON_MAP[win.id] || Terminal;
          const isActive = activeWindowId === win.id && !win.isMinimized;

          return (
            <button
              key={win.id}
              onClick={() =>
                win.isMinimized || activeWindowId !== win.id
                  ? focusWindow(win.id)
                  : toggleMinimize(win.id)
              }
              className={`flex items-center gap-3 p-2.5 rounded transition-all group relative ${isActive ? "bg-cyan-500/10 text-cyan-400" : "hover:bg-white/5 text-zinc-500"}`}
              title={!isSidebarOpen ? win.title : ""}
            >
              <Icon
                size={18}
                className={
                  isActive ? "text-cyan-400" : "group-hover:text-cyan-300"
                }
              />
              {isSidebarOpen && (
                <span className="text-xs font-medium truncate">
                  {win.title}
                </span>
              )}

              {/* Status Dot */}
              <div
                className={`absolute right-2 w-1 h-1 rounded-full ${win.isMinimized ? "bg-zinc-700" : "bg-cyan-500 shadow-[0_0_8px_cyan]"}`}
              />
            </button>
          );
        })}
      </div>

      <div
        className={`p-4 border-t md:border-l-0 md:border-t border-gray-800 cursor-pointer hover:bg-gray-900/80 transition-colors text-center ${!isSidebarOpen && "border-l md:border-t hidden md:block"}`}
        onClick={onLogout}
      >
        <p className="text-sm text-gray-400 hover:text-white">
          {isSidebarOpen ? "Log out" : "Exit"}
        </p>
      </div>

      <div className={`p-4 border-t border-gray-800 flex items-center justify-center ${!isSidebarOpen && "hidden md:flex"}`}>
        {isSidebarOpen ? (
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold tracking-widest w-full justify-between">
            <span>SYS.STATUS</span>

            <div className="flex items-center gap-1">
              <span className="text-green-500">ONLINE</span>

              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        )}
      </div>
    </aside>
  );
}
