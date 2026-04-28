'use client';

import SpaceGlob from "./SpaceGlob";
import { useState } from "react";
/* eslint-disable @next/next/no-img-element */

interface NasaApodResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

const GeoTracker = () => {
    const [date, setDate] = useState('');
    const [nasaData, setNasaData] = useState<NasaApodResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;

        setLoading(true);
        setError(null);

        try {
            const apiKey = 'DEMO_KEY'; 
            const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
            if (!response.ok) throw new Error('Failed to retrieve APOD data.');
            
            const data = await response.json();
            setNasaData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
   
        <style>{`
            .sci-fi-scroll::-webkit-scrollbar {
                width: 6px;
            }
            .sci-fi-scroll::-webkit-scrollbar-track {
                background: rgba(15, 23, 42, 0.3);
            }
            .sci-fi-scroll::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
            }
            .sci-fi-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.45);
            }
        `}</style>

        {/* Main Container */}
        <div className="h-full w-full p-4 md:p-6 lg:p-8 flex flex-col gap-8 overflow-y-auto overflow-x-hidden sci-fi-scroll">
            
            {/* UPPER SECTION: Large Globe Hero */}
            <div className="w-full min-h-[45vh] lg:min-h-[55vh] flex items-center justify-center relative rounded-2xl border border-white/20 bg-slate-950/40  overflow-hidden">
                <SpaceGlob />
                
                {/* Decorative element */}
                <div className="absolute top-4 left-4 text-zinc-500 text-[10px] tracking-widest font-mono">
                    SYS.ORBITAL_VIEW_ACTIVE //
                </div>
            </div>

            {/* LOWER SECTION: Centered NASA Module */}
            <div className="flex justify-center w-full">
                
                <div className="w-full max-w-2xl flex flex-col gap-5 bg-slate-900/40 border border-white/20 rounded-2xl p-5 md:p-7 shadow-[0_0_20px_rgba(255,255,255,0.08)] backdrop-blur-md">
                    
                    {/* Header */}
                    <div className="border-b border-white/20 pb-3">
                        <h2 className="text-zinc-100 text-sm font-bold tracking-widest uppercase font-mono">
                            NASA APOD Archive
                        </h2>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleSearch} className="flex gap-3 w-full">
                        <input 
                            className="flex-1 bg-black/50 text-zinc-200 placeholder:text-zinc-600 border border-white/20 rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all"
                            type="date"
                            value={date} 
                            min="1995-06-16"
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-white/10 text-zinc-100 border border-white/30 rounded-lg font-mono text-sm hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            INITIALIZE
                        </button>
                    </form>


                    <div className="relative flex min-h-70 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-black/40 p-2">
                  
                        <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] opacity-20"></div>

                        {loading && (
                            <p className="text-zinc-300 animate-pulse font-mono text-sm z-20">CONNECTING TO SATELLITES...</p>
                        )}
                        {error && (
                            <p className="text-red-400 text-sm font-mono z-20">[ERROR]: {error}</p>
                        )}
                        {nasaData && !loading && !error && (
                            <div className="flex flex-col gap-3 items-center w-full h-full p-2 z-20">
                                {nasaData.media_type === "image" ? (
                                    <img 
                                        src={nasaData.url} 
                                        alt={nasaData.title} 
                                        className="w-full max-h-75 rounded-lg object-contain"
                                    />
                                ) : (
                                    <iframe 
                                        src={nasaData.url} 
                                        title={nasaData.title} 
                                        className="rounded-lg w-full aspect-video"
                                        allowFullScreen
                                    />
                                )}
                                <p className="text-zinc-100 font-semibold text-xs md:text-sm text-center font-mono">{nasaData.title}</p>
                            </div>
                        )}
                        {!nasaData && !loading && !error && (
                            <p className="text-zinc-600 text-sm text-center font-mono z-20">
                                AWAITING DATE SELECTION...
                            </p>
                        )}
                    </div>
                </div> 
                
            </div>
        </div>
    </>
  )
}

export default GeoTracker;