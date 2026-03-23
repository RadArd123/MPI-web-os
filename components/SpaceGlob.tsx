'use client';

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const activeUsers = [
  { lat: 45.6, lng: 25.6, size: 0.5, color: "#22d3ee", name: "Tu: Caut Wi-Fi" },

  {
    lat: 48.85,
    lng: 2.35,
    size: 0.5,
    color: "#a855f7",
    name: "Alien_X: Rătăcit",
  },

  {
    lat: 40.71,
    lng: -74.0,
    size: 0.5,
    color: "#4ade80",
    name: "Zorblax: Mănânc pizza",
  },

  {
    lat: 35.68,
    lng: 139.76,
    size: 0.5,
    color: "#facc15",
    name: "Neo: Lag 500ms",
  },
];

export default function SpaceGlobe() {
  const globeEl = useRef<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;

      globeEl.current.controls().autoRotateSpeed = 0.5;

      globeEl.current.pointOfView(
        { altitude: 2.2, lat: 45.6, lng: 25.6 },
        2000,
      ); // Focus pe România la load
    }
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-3xl overflow-hidden relative bg-transparent flex items-center justify-center"
    >
   <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        
        // AICI E MODIFICAREA: Folosim textura de zi în loc de cea de noapte
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Randăm Labels în loc de Puncte simple pentru a vedea statusul
        labelsData={activeUsers}
        labelLat={(d) => (d as any).lat}
        labelLng={(d) => (d as any).lng}
        labelText={(d) => (d as any).name}
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={(d) => (d as any).color}
        labelResolution={2}
        showAtmosphere={true}
        atmosphereColor="#0ea5e9"
        atmosphereAltitude={0.15}
      />

      <div className="absolute bottom-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-cyan-500 uppercase tracking-widest pointer-events-none">
        Live Tracking: 4 Entities
      </div>
    </div>
  );
}
