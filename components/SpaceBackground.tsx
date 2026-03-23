"use client";

import { useEffect, useRef } from "react";


interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  active: boolean;
}

interface MousePosition {
  realX: number;
  realY: number;
}

const mouse: MousePosition = {
  realX: 0,
  realY: 0,
};

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      size: 2,
      dx: 0,
      dy: 0,
      active: false,
    };

    let timeoutId: NodeJS.Timeout;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.realX = e.clientX;
      mouse.realY = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const stars: Star[] = [];
    for (let i = 0; i < 250; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2,
        opacity: Math.random(),
        velocity: Math.random() * 0.2 + 0.1,
      });
    }
    const spawnShootingStar = () => {
      const isGoingRight = Math.random() > 0.5;

      if (isGoingRight) {
        // Vine din STÂNGA spre DREAPTA
        shootingStar.x = -50;
        shootingStar.dx = 9 + Math.random() * 10; // Pozitiv (merge spre dreapta)
      } else {
        // Vine din DREAPTA spre STÂNGA
        shootingStar.x = canvas.width + 50;
        shootingStar.dx = -(9 + Math.random() * 10); // Negativ (merge spre stânga)
      }

      shootingStar.y = Math.random() * (canvas.height * 0.3);
      shootingStar.dy = 6 + Math.random() * 5;
      shootingStar.size = 4 + Math.random() * 2;
      shootingStar.active = true;

      timeoutId = setTimeout(spawnShootingStar, 3000 + Math.random() * 3000);
    };
    setTimeout(spawnShootingStar, 2000);

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y = star.y + star.velocity;

        if (star.y > window.innerHeight) {
          star.y = 0;
          star.x = Math.random() * window.innerWidth;
        }

        const dx = mouse.realX - star.x;
        const dy = mouse.realY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const influenceRadius = 100;
        let pushX = 0;
        let pushY = 0;

        if (distance < influenceRadius) {
          const force = (influenceRadius - distance) / influenceRadius;
          pushX = dx * force * 0.3;
          pushY = dy * force * 0.3;
        }
        ctx.beginPath();

        ctx.arc(star.x + pushX, star.y + pushY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    };
    const drawShootingStar = () => {
      if (shootingStar.active) {
        shootingStar.x = shootingStar.x + shootingStar.dx;
        shootingStar.y = shootingStar.y + shootingStar.dy;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.dx * 3,
          shootingStar.y - shootingStar.dy * 3,
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          shootingStar.x,
          shootingStar.y,
          shootingStar.size,
          0,
          Math.PI * 2,
        );
        ctx.shadowBlur = 2;
        ctx.shadowColor = "white";
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (
          shootingStar.x > canvas.width + 100 ||
          shootingStar.x < -100 ||
          shootingStar.y > canvas.height
        ) {
          shootingStar.active = false;
        }
      }
    };

    const animate = () => {
      drawStars();
      drawShootingStar();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block pointer-events-none"
      />
  );
}