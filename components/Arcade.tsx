"use client";

import { useState, useEffect, useRef } from "react";

const LOADING_TIPS = [
  "Sharpening swords...",
  "Loading pixel warriors...",
  "Calibrating attack hitboxes...",
  "Summoning the arena...",
  "Polishing health bars...",
  "Warming up fighters...",
  "Rendering the battlefield...",
  "Preparing combo moves...",
];

export default function Arcade() {
  const gameUrl = "/games/work/index.html";
  const [phase, setPhase] = useState<"loading" | "ready" | "playing">("loading");
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const restartGame = () => {
    setIframeKey((k) => k + 1);
  };

  const exitGame = () => {
    setPhase("loading");
    setProgress(0);
  };


  useEffect(() => {
    if (phase !== "loading") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("ready"), 400);
          return 100;
        }
        // Variable speed — slows near 70%, fast burst at end
        const speed = prev < 30 ? 3 : prev < 70 ? 1.5 : prev < 90 ? 4 : 2;
        return Math.min(prev + speed + Math.random() * 2, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);


  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % LOADING_TIPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [phase]);


  useEffect(() => {
    if (phase === "playing" && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [phase]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#0a0a0f" }}>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.97; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.05); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5), inset 0 0 30px rgba(139, 92, 246, 0.1); }
        }
        @keyframes bar-shine {
          0% { left: -40%; }
          100% { left: 140%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glitch-text {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes boot-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .scanline-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 2px,
            rgba(0, 0, 0, 0.08) 4px
          );
          pointer-events: none;
          z-index: 2;
        }
        .scanline-beam {
          position: absolute;
          width: 100%;
          height: 60px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(139, 92, 246, 0.04),
            transparent
          );
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 3;
        }
      `}</style>

      {phase !== "playing" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 scanline-overlay"
          style={{
            animation: "flicker 0.15s infinite",
            background: "radial-gradient(ellipse at center, #12121f 0%, #0a0a0f 70%)",
          }}
        >
          <div className="scanline-beam" />

          <div
            className="mb-8 text-center"
            style={{
              animation: glitch ? "glitch-text 0.15s steps(4) infinite" : "float 3s ease-in-out infinite",
            }}
          >
            <div className="text-5xl mb-2" style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.6))" }}>
              ⚔️
            </div>
            <h1
              className="text-2xl font-black tracking-[0.3em] uppercase"
              style={{
                background: "linear-gradient(135deg, #c084fc, #818cf8, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: glitch ? "hue-rotate(90deg)" : "none",
                textShadow: "none",
              }}
            >
              ARENA COMBAT
            </h1>
            <p className="text-[10px] tracking-[0.5em] text-zinc-600 mt-1 uppercase">
              v1.0 • 2 PLAYER DUEL
            </p>
          </div>


          {phase === "loading" && (
            <div className="w-72 mb-6" style={{ animation: "fade-in-up 0.5s ease-out" }}>

              <div
                className="relative h-4 rounded-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >

                <div
                  className="h-full rounded-full transition-all duration-200 ease-out relative"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
                    boxShadow: "0 0 16px rgba(139, 92, 246, 0.5)",
                  }}
                >

                  <div
                    className="absolute top-0 h-full w-[40%] rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      animation: "bar-shine 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>


              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-zinc-600">
                  {LOADING_TIPS[tipIndex]}
                </span>
                <span className="text-[10px] font-mono text-violet-400 font-bold">
                  {Math.floor(progress)}%
                </span>
              </div>
            </div>
          )}

          {phase === "ready" && (
            <div style={{ animation: "boot-in 0.5s ease-out" }}>
              <button
                onClick={() => setPhase("playing")}
                className="group relative px-10 py-3 rounded-lg font-bold text-sm uppercase tracking-[0.3em] cursor-pointer transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  color: "#c084fc",
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.8)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ▶ START GAME
              </button>


              <div className="mt-8 flex gap-8 justify-center">
                <div className="text-center">
                  <p className="text-[9px] text-violet-400 font-bold tracking-widest uppercase mb-2">Player 1</p>
                  <div className="flex gap-1 justify-center">
                    {["W", "A", "D"].map((k) => (
                      <span key={k} className="inline-block px-2 py-1 rounded text-[10px] font-mono font-bold text-zinc-400"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {k}
                      </span>
                    ))}
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-mono font-bold text-zinc-400"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      SPACE
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-violet-400 font-bold tracking-widest uppercase mb-2">Player 2</p>
                  <div className="flex gap-1 justify-center">
                    {["↑", "←", "→"].map((k) => (
                      <span key={k} className="inline-block px-2 py-1 rounded text-[10px] font-mono font-bold text-zinc-400"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {k}
                      </span>
                    ))}
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-mono font-bold text-zinc-400"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}


          <div className="absolute bottom-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{
                  background: i === (tipIndex % 3) ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {phase === "playing" && (
        <>

          <div
            className="absolute top-2 right-2 z-20 flex gap-1"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <button
              onClick={restartGame}
              title="Restart Game"
              className="w-8 h-8 rounded-md flex items-center justify-center text-sm cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139,92,246,0.3)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
              }}
            >
              🔄
            </button>
            <button
              onClick={exitGame}
              title="Exit to Menu"
              className="w-8 h-8 rounded-md flex items-center justify-center text-sm cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.3)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              }}
            >
              ✕
            </button>
          </div>

          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={gameUrl}
            className="w-full h-full"
            style={{ border: "none" }}
            tabIndex={0}
          />
        </>
      )}
    </div>
  );
}
