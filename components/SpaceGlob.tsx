'use client';

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface ActiveUser {
  id: string; // Added an ID to easily identify the current user
  lat: number;
  lng: number;
  size: number;
  color: string;
  name: string;
}

const initialUsers: ActiveUser[] = [
  {
    id: "me",
    lat: 45.6,
    lng: 25.6, // Default location
    size: 0.5,
    color: "#22d3ee",
    name: "You: Waiting for location...",
  },
  {
    id: "alien",
    lat: 48.85,
    lng: 2.35,
    size: 0.5,
    color: "#a855f7",
    name: "Alien_X: Lost",
  },
  {
    id: "zorblax",
    lat: 40.71,
    lng: -74.0,
    size: 0.5,
    color: "#4ade80",
    name: "Zorblax: Eating pizza",
  },
  {
    id: "neo",
    lat: 35.68,
    lng: 139.76,
    size: 0.5,
    color: "#facc15",
    name: "Neo: 500ms lag",
  },
];

export default function SpaceGlobe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [users, setUsers] = useState<ActiveUser[]>(initialUsers);
  const [isLocating, setIsLocating] = useState(false);

  // Resize Observer for responsiveness
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

  // Initial globe settings
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView(
        { altitude: 2.2, lat: 45.6, lng: 25.6 },
        2000
      );
    }
  }, [dimensions]);

  // Function to request location
  const handleFindMe = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Replace the entire list with just your location
        setUsers([
          {
            id: "me",
            lat: latitude,
            lng: longitude,
            size: 0.5,
            color: "#22d3ee", // Keep your color (cyan)
            name: "You: Location Found!",
          }
        ]);

        // Stop auto-rotation and fly the camera to the new location
        if (globeEl.current) {
          globeEl.current.controls().autoRotate = false;
          globeEl.current.pointOfView(
            { altitude: 1.5, lat: latitude, lng: longitude },
            2000 // 2-second animation
          );
        }

        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Could not get location. Did you grant permission?");
        setIsLocating(false);
      }
    );
  };

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
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        labelsData={users}
        labelLat={(d) => (d as ActiveUser).lat}
        labelLng={(d) => (d as ActiveUser).lng}
        labelText={(d) => (d as ActiveUser).name}
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={(d) => (d as ActiveUser).color}
        labelResolution={2}
        showAtmosphere={true}
        atmosphereColor="#0ea5e9"
        atmosphereAltitude={0.15}
      />

      {/* Find Me Button */}
      <button
        onClick={handleFindMe}
        disabled={isLocating}
        className="absolute top-4 right-4 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 text-sm font-semibold border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        {isLocating ? "Scanning satellite..." : "📍 Locate me"}
      </button>

      <div className="absolute bottom-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-cyan-500 uppercase tracking-widest pointer-events-none">
        Live Tracking: {users.length} Entities
      </div>
    </div>
  );
}