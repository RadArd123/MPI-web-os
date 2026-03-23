'use client';

import { useState } from 'react';
import { 
  Terminal, 
  Gamepad2, 
  Settings, 
  FolderClosed, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Cpu, 
  Database 
} from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import { useAuthStore } from '@/store/authStore';


const desktopApps = [
  { id: 'captains-log', name: 'Captain_Log', icon: Terminal, color: 'text-cyan-400' },
  { id: 'arcade', name: 'Arcade_Module', icon: Gamepad2, color: 'text-purple-400' },
  { id: 'files', name: 'Stellar_Drive', icon: FolderClosed, color: 'text-yellow-400' },
  { id: 'monitor', name: 'Sys_Monitor', icon: Activity, color: 'text-green-400' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-400' },
];

export default function WebOSDesktop() {

  const {logout} = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Containerul principal care ține tot ecranul
    <div className="flex h-screen w-screen bg-[#020202] text-gray-300 font-mono overflow-hidden selection:bg-cyan-900 relative">
      
      {/* Background animat/sci-fi */}
      <SpaceBackground />

      {/* --- SIDEBAR RETRACTABIL --- */}
      <aside 
        className={`relative z-10 flex flex-col bg-black/60 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header Sidebar + Buton de Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10 text-cyan-400 font-bold text-xs">
                R
              </div>
              <span className="text-sm font-bold tracking-widest text-white whitespace-nowrap">STELLAR.OS</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors absolute right-[-14px] top-5 z-20 shadow-lg"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Meniu Sidebar */}
        <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-hidden">
          {/* Item 1 */}
          <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-900/80 transition-colors w-full group">
            <Cpu size={20} className="text-gray-500 group-hover:text-cyan-400 min-w-[20px]" />
            {isSidebarOpen && <span className="text-xs tracking-wide text-gray-400 group-hover:text-white whitespace-nowrap">Core Processing</span>}
          </button>
          {/* Item 2 */}
          <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-900/80 transition-colors w-full group">
            <Database size={20} className="text-gray-500 group-hover:text-cyan-400 min-w-[20px]" />
            {isSidebarOpen && <span className="text-xs tracking-wide text-gray-400 group-hover:text-white whitespace-nowrap">Data Uplink</span>}
          </button>
        </div>
        <div className="p-4 border-t border-gray-800 cursor-pointer hover:bg-gray-900/80 transition-colors text-center" onClick={handleLogout}>
          <p className="text-sm text-gray-400 group-hover:text-white">Log out</p>
        </div>

        {/* Footer Sidebar (Status) */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-center">
           {isSidebarOpen ? (
             <div className="flex items-center gap-2 text-xs text-gray-500 font-bold tracking-widest w-full justify-between">
               <span>SYS.STATUS</span>
               <div className="flex items-center gap-1"><span className="text-green-500">ONLINE</span><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div></div>
             </div>
           ) : (
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           )}
        </div>
      </aside>

      {/* --- DESKTOP AREA --- */}
      <main className="flex-1 relative z-10 p-8">
        
        {/* Grid-ul de iconițe de pe Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {desktopApps.map((app) => (
            <div 
              key={app.id} 
              className="flex flex-col items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all group border border-transparent hover:border-gray-800"
              onClick={() => console.log(`Ai dat click pe ${app.name}`)}
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

      </main>

    </div>
  );
}

