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

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { windows, activeWindowId, focusWindow, toggleMinimize } =
    useWindowStore();

  return (
    <aside
      className={`relative z-50 flex flex-col bg-black/60 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}
    >

      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-bold text-[10px]">
              R
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-white">
              STELLAR.OS
            </span>
          </div>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-400 absolute right-[-12px] top-6 z-20 shadow-xl"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      </div>

      {/* Dynamic Process List */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar">
        {windows.length > 0 && (
          <p
            className={`text-[9px] font-bold text-zinc-600 mb-2 px-2 tracking-widest ${!isSidebarOpen && "text-center"}`}
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
        className="p-4 border-t border-gray-800 cursor-pointer hover:bg-gray-900/80 transition-colors text-center"
        onClick={onLogout}
      >
        <p className="text-sm text-gray-400 hover:text-white">
          {isSidebarOpen ? "Log out" : "Exit"}
        </p>
      </div>

      <div className="p-4 border-t border-gray-800 flex items-center justify-center">
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
