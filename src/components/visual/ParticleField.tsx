"use client";

/**
 * <ParticleField> — canvas-rendered drifting sparkles.
 *
 * Cheap (~60 particles, sub-ms per frame). Drop into any container with
 * `position: relative`. The canvas fills the parent and re-syncs on
 * window resize and on parent size changes (ResizeObserver).
 */

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  density?: number;
  hue?: "pink" | "blue" | "mixed" | "gold";
}

const palettes: Record<string, string[]> = {
  pink: ["#FF3D9A", "#FF7AC0", "#FBF7FF"],
  blue: ["#3DCBFF", "#7BE0FF", "#FBF7FF"],
  mixed: ["#FF3D9A", "#3DCBFF", "#8A5BFF", "#FFD66B", "#FBF7FF"],
  gold: ["#FFD66B", "#FBF7FF", "#FF7AC0"],
};

export function ParticleField({
  className = "",
  density = 60,
  hue = "mixed",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = palettes[hue];

    type P = { x: number; y: number; r: number; vx: number; vy: number; c: string; a: number; ph: number };
    let particles: P[] = [];

    const resize = () => {
      // Measure the parent — the canvas itself is replaced-element and can
      // report stale 300×150 default dimensions before layout settles.
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      // Reset transform absolutely (do NOT chain ctx.scale, it accumulates).
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.3 - 0.05,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: Math.random() * 0.6 + 0.2,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.ph += 0.02;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flick = 0.5 + 0.5 * Math.sin(p.ph);
        ctx.globalAlpha = p.a * flick;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = p.a * flick * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      resize();
      // re-clamp particles into new bounds without full reseed
      for (const p of particles) {
        if (p.x > w) p.x = Math.random() * w;
        if (p.y > h) p.y = Math.random() * h;
      }
    };

    window.addEventListener("resize", onResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [density, hue]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%", zIndex: 0 }}
      aria-hidden
    />
  );
}
