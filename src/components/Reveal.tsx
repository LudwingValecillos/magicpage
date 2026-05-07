"use client";

/**
 * <Reveal> — declarative scroll-triggered fade + slide.
 *
 * Wraps children in a div, then before paint sets initial state
 * (opacity 0, translateY) and starts an IntersectionObserver. When the
 * element enters the viewport, anime.js tweens it to its final state.
 *
 * Uses useLayoutEffect (SSR-safe) so no flash between SSR render and
 * first animation frame.
 *
 * EXAMPLES
 *   <Reveal>                              fade in self
 *     <h2>Section title</h2>
 *   </Reveal>
 *
 *   <Reveal stagger={80} y={48}>          stagger children
 *     <Card />
 *     <Card />
 *   </Reveal>
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { revealOnScroll, type RevealOptions } from "@/lib/anime/scroll";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface RevealProps extends RevealOptions {
  children: React.ReactNode;
  className?: string;
}

export function Reveal({ children, className, ...opts }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const anim = revealOnScroll(ref.current, opts);
    return () => {
      anim?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
