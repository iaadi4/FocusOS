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
    const spacing = 42; // Space between dots
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
            speed: Math.random() * 0.0015 + 0.0008, // Subtle industrial breathing speed
            offset: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now();

      particles.forEach((p) => {
        const cycle = Math.sin(time * p.speed + p.offset);
        // Alpha oscillates between ~0.08 and ~0.28
        const alpha = ((cycle + 1) / 2) * 0.2 + 0.08;

        // Warm gold #C9A96E (RGB: 201, 169, 110)
        ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
        ctx.beginPath();
        const currentSize = p.baseSize + (cycle + 1) * 0.4;
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
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
      style={{ background: "transparent" }}
    />
  );
}
