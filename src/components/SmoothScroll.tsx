"use client";

/**
 * SmoothScroll — smooth scrolling site-wide con Lenis.
 *
 * - Respeta prefers-reduced-motion: no inicializa nada si está activo.
 * - rAF loop propio; se limpia al desmontar.
 *
 * TODO: si los drawers/modales (Cart, Search) necesitan bloquear el scroll de
 * fondo, llamar a lenis.stop()/start() desde el StoreProvider al abrir/cerrar.
 */

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      // gesto táctil nativo en mobile (más predecible que smooth en touch)
      syncTouch: false,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
