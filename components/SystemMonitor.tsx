'use client';

import { Cpu, HardDrive, Activity, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '@/store/windowStore';
import type { WindowState, WindowInstance } from '@/types/window.types';

export const useSystemStats = () => {
  const [stats, setStats] = useState({
    cpuCores: 0,
    gpu: 'Detecting...',
    ramUsed: 0,
    ramLimit: 0,
    uptime: 0
  });

  const [ramHistory, setRamHistory] = useState<number[]>(new Array(60).fill(0));

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 0;


    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    let gpuName = 'Virtualized GPU (ANGLE)';

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const raw = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        gpuName = raw.split(',')[1]?.trim() || raw.split('Direct3D')[0]?.trim() || raw;
      }
    }

    const updateMetrics = () => {
      // @ts-expect-error Typescript doesn't know about window.performance.memory
      const mem = window.performance?.memory;


      const jsHeap = mem ? Math.round(mem.usedJSHeapSize / 1048576) : 0;

      const processOffset = 88 + (Math.sin(Date.now() / 1000) * 2);

      const totalRamRealist = Math.round(jsHeap + processOffset);
      const limitRam = mem ? Math.round(mem.jsHeapSizeLimit / 1048576) : 4096;

      setStats(prev => ({
        ...prev,
        cpuCores: cores,
        gpu: gpuName,
        ramUsed: totalRamRealist,
        ramLimit: limitRam,
        uptime: prev.uptime + 1
      }));

      setRamHistory(prev => {
        const next = [...prev, totalRamRealist];
        return next.slice(-60);
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return { stats, ramHistory };
};

function MemoryChart({ data }: { data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const max = Math.max(...data, 100) * 1.2;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    for (let i = 0; i < w; i += 25) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i < h; i += 20) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    const step = w / (data.length - 1);
    data.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / max) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();


    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }, [data]);

  return <canvas ref={canvasRef} width={600} height={120} className="w-full h-24 mt-2" />;
}


export function SystemMonitor() {
  const { stats, ramHistory } = useSystemStats();
  const ramPercentage = (stats.ramUsed / stats.ramLimit) * 100 || 0;

  const windows = useWindowStore((state: WindowState) => state.windows);
  const closeWindow = useWindowStore((state: WindowState) => state.closeWindow);

  return (
    <div className="space-y-6 text-zinc-300 font-mono select-none overflow-y-auto max-h-[85vh] scr">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 p-4 border border-white/5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-500 mb-2">
            <Cpu size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Processor</span>
          </div>
          <div className="text-2xl font-light">{stats.cpuCores} <span className="text-xs text-zinc-600 uppercase">Threads</span></div>
        </div>

        <div className="bg-zinc-900/40 p-4 border border-white/5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Uptime</span>
          </div>
          <div className="text-2xl font-light">{stats.uptime}s</div>
        </div>
      </div>

      <div className="space-y-4 bg-zinc-900/20 p-4 border border-white/5 rounded-lg">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Memory Uplink</div>
            <div className="text-sm font-bold text-cyan-400">{stats.ramUsed} MB <span className="text-zinc-600 font-normal">/ {stats.ramLimit} MB</span></div>
          </div>
          <div className="text-[9px] text-cyan-500/40 animate-pulse tracking-tighter italic">LIVE_FEED_STABLE</div>
        </div>

        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
            style={{ width: `${Math.min(ramPercentage, 100)}%` }}
          />
        </div>

        <MemoryChart data={ramHistory} />
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-xs text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Processes (Task Manager)</h3>

        <div className="space-y-2">

          <div className="flex items-center justify-between p-2 rounded bg-zinc-900/40 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-zinc-200">Web OS Core</div>
                <div className="text-[10px] text-zinc-500">System</div>
              </div>
            </div>
            <div className="flex space-x-4 text-xs text-zinc-400">
              <div>{(stats.ramUsed * 0.3).toFixed(1)} MB</div>
              <div className="w-12 text-right">0.8% Cpu</div>
            </div>
          </div>


          {windows && windows.length > 0 ? windows.map((win: WindowInstance) => {

            const mockMem = (win.id.length * 12 + Math.random() * 5).toFixed(1);
            const mockCpu = (Math.random() * 2).toFixed(1);

            return (
              <div key={win.id} className="flex items-center justify-between p-2 rounded hover:bg-zinc-800/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Zap size={14} className="text-emerald-500" />
                  <div>
                    <div className="text-sm text-zinc-300">{win.title}</div>
                    <div className="text-[10px] text-zinc-600">User App</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-emerald-400/80">{mockMem} MB</div>
                  <div className="w-12 text-right text-zinc-500">{mockCpu}% Cpu</div>
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                    title="End Process"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>
              </div>
            )
          }) : (
            <div className="text-xs text-zinc-600 italic px-2 py-4 text-center">No other apps running</div>
          )}
        </div>
      </div>
    </div>
  );
}
