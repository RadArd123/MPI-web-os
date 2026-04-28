'use client';

import {
  Terminal,
  Gamepad2,
  Settings,
  FolderClosed,
  Activity,
  Earth,
  FolderKanban
} from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/authStore';
import Window from '@/components/Window';
import { useWindowStore } from '@/store/windowStore';
import CaptainsLog from '@/components/CaptainsLog';
import Arcade from '@/components/Arcade';
import { Explorer } from '@/components/Explorer';
import { SystemMonitor } from '@/components/SystemMonitor';
import SettingsPanel from '@/components/SettingsPanel';
import GeoTracker from '@/components/GeoTracker';
import { useProfileStore } from '@/store/profileStore';
import ProjectExplorer from '@/components/ProjectExplorer';





const desktopApps = [
  { id: 'captains-log', name: 'Captain_Log', icon: Terminal, color: 'text-cyan-400' },
  { id: 'arcade', name: 'Arcade_Module', icon: Gamepad2, color: 'text-purple-400' },
  { id: 'files', name: 'Stellar_Drive', icon: FolderClosed, color: 'text-yellow-400' },
  { id: 'monitor', name: 'Sys_Monitor', icon: Activity, color: 'text-green-400' },
  { id: 'geotracker', name: 'Geo_Tracker', icon: Earth, color: 'text-blue-400' },
  { id: 'portfolio', name: 'Portfolio', icon: FolderKanban, color: 'text-gray-400' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-400' },
];

export default function WebOSDesktop() {
  const { logout, user } = useAuthStore();
  const { profile} = useProfileStore();
  const { windows, openWindow, closeWindow, focusWindow, toggleMinimize, toggleMaximize } = useWindowStore();

  return (

    <div className="flex h-dvh w-screen flex-col-reverse overflow-hidden bg-[#020202] font-mono text-gray-300 selection:bg-zinc-700 md:flex-row relative">

      <SpaceBackground />


      <Sidebar onLogout={logout} name={profile?.operatorName || user?.name || user?.operatorName || 'User'} />

      <main className="flex-1 relative z-10 p-4 md:p-8 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {desktopApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all group border border-transparent hover:border-gray-800"
              onClick={() => openWindow(app.id, app.name)}
            >
              <div className={`p-4 rounded-2xl bg-black/40 border border-gray-800 shadow-lg group-hover:-translate-y-1 transition-transform duration-200 ${app.color}`}>
                <app.icon size={32} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white text-center font-medium drop-shadow-md">
                {app.name}
              </span>
            </div>
          ))}
        </div>
        {windows.map((win) => (
          < Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            isMaximized={win.isMaximized}
            isMinimized={win.isMinimized}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMinimized={() => toggleMinimize(win.id)}
            onMaximized={() => toggleMaximize(win.id)}


          >

            {win.id === 'captains-log' && <CaptainsLog />}
            {win.id === 'arcade' && <Arcade />}
            {win.id === 'files' && <Explorer />}
            {win.id === 'monitor' && <SystemMonitor />}
            {win.id === 'geotracker' && <GeoTracker />}
            {win.id === 'settings' && <SettingsPanel />}
            {win.id === 'portfolio' && <ProjectExplorer />}
          </Window>
        ))}
      </main>

    </div>
  );
}