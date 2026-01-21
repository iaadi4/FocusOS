"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  speed: number;
  offset: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Grid configuration
    const spacing = 40; // Space between dots
    const baseSize = 1.2; // Min size

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing + spacing / 2,
            y: j * spacing + spacing / 2,
            baseSize: baseSize,
            size: baseSize,
            speed: Math.random() * 0.002 + 0.001, // Breathing speed
            offset: Math.random() * Math.PI * 2, // Random starting phase
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now();

      particles.forEach((p) => {
        // Breathing formula: size oscillates using sine wave
        const cycle = Math.sin(time * p.speed + p.offset);
        // Map sine (-1 to 1) to opacity/size range
        // We want opacity to go from ~0.1 to ~0.5
        const alpha = ((cycle + 1) / 2) * 0.4 + 0.1;

        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`; // Purple-500 equivalent
        ctx.beginPath();
        // Size also breathes slightly
        const currentSize = p.baseSize + (cycle + 1) * 0.5;
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      style={{ background: "transparent" }}
    />
  );
}
