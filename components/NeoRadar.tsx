import { motion } from "framer-motion";
import {
  // ... restul iconițelor tale
  Target,
  Globe,
  Satellite,
  Moon,
  Rocket,
  Orbit
} from "lucide-react";
import {GlassCard} from "./GlassCard";


export function NeoRadar() {
    return (
     <div>
            <GlassCard delay={0.3} className="relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold flex items-center gap-2">
                  <Target size={18} className="text-cyan-400" /> Orbital Telemetry
                </h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">Live Distances</span>
              </div>
              
              <div className="space-y-6 relative z-10">
                 
                 {/* Item 1: ISS */}
                 <div className="relative">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-2 px-1">
                      <span className="font-bold text-blue-400">EARTH</span>
                      <span className="font-bold text-gray-200">ISS</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe className="w-5 h-5 text-blue-500" />
                       <div className="flex-1 border-b-2 border-dashed border-white/20 relative flex items-center justify-center">
                          {/* Animated Signal Blip */}
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[3px] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] z-20"
                          />
                          {/* Distance Label */}
                          <span className="absolute -top-3 text-[10px] font-mono text-cyan-400 bg-[#0a0a0c] px-2 z-10">
                            408 KM
                          </span>
                       </div>
                       <Satellite className="w-5 h-5 text-gray-300" />
                    </div>
                 </div>

                 {/* Item 2: The Moon */}
                 <div className="relative">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-2 px-1">
                      <span className="font-bold text-blue-400">EARTH</span>
                      <span className="font-bold text-gray-200">LUNA</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe className="w-5 h-5 text-blue-500" />
                       <div className="flex-1 border-b-2 border-dashed border-white/20 relative flex items-center justify-center">
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[3px] w-2 h-2 rounded-full bg-gray-300 shadow-[0_0_8px_#ffffff] z-20"
                          />
                          <span className="absolute -top-3 text-[10px] font-mono text-gray-300 bg-[#0a0a0c] px-2 z-10">
                            384K KM
                          </span>
                       </div>
                       <Moon className="w-5 h-5 text-gray-300" />
                    </div>
                 </div>

                 {/* Item 3: Mars */}
                 <div className="relative">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-2 px-1">
                      <span className="font-bold text-blue-400">EARTH</span>
                      <span className="font-bold text-orange-400">MARS</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe className="w-5 h-5 text-blue-500" />
                       <div className="flex-1 border-b-2 border-dashed border-white/20 relative flex items-center justify-center">
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[3px] w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] z-20"
                          />
                          <span className="absolute -top-3 text-[10px] font-mono text-orange-400 bg-[#0a0a0c] px-2 z-10">
                            225M KM
                          </span>
                       </div>
                       <Orbit className="w-5 h-5 text-orange-500" />
                    </div>
                 </div>

                 {/* Item 4: Voyager 1 (Deep Space) */}
                 <div className="relative opacity-70">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-2 px-1">
                      <span className="font-bold text-blue-400">EARTH</span>
                      <span className="font-bold text-purple-400">VOYAGER 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe className="w-5 h-5 text-blue-500" />
                       <div className="flex-1 border-b-2 border-dashed border-white/10 relative flex items-center justify-center">
                          <motion.div 
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[3px] w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] z-20"
                          />
                          <span className="absolute -top-3 text-[10px] font-mono text-purple-400 bg-[#0a0a0c] px-2 z-10">
                            24B KM
                          </span>
                       </div>
                       <Rocket className="w-5 h-5 text-purple-400" />
                    </div>
                 </div>

              </div>
            </GlassCard>
            </div>
    );
}