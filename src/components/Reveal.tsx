"use client";

/**
 * <Reveal> — scroll-triggered fade + slide, ahora sobre framer-motion.
 *
 * Mantiene la MISMA API que la versión anime.js anterior (props y/stagger/
 * duration/delay/threshold/rootMargin/repeat) para no tocar los call-sites.
 *
 * - Sin stagger: anima el contenedor entero al entrar al viewport.
 * - Con stagger: envuelve cada hijo directo en un motion.div y los escalona.
 *   (El wrapper pasa a ser el ítem de grid; el layout se preserva.)
 * - Respeta prefers-reduced-motion: si está activo, no anima (render directo).
 *
 * EXAMPLES
 *   <Reveal><h2>Título</h2></Reveal>
 *   <Reveal stagger={80} y={40} className="grid grid-cols-3"> ...cards... </Reveal>
 */

import { Children, isValidElement } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { RevealOptions } from "@/lib/anime/scroll";

interface RevealProps extends RevealOptions {
  children: React.ReactNode;
  className?: string;
}

// ease-out-quart (mismo cubic-bezier que --ease-out-quart en globals.css)
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function Reveal({
  children,
  className,
  y = 32,
  stagger = 0,
  duration = 500,
  delay = 0,
  threshold = 0.12,
  rootMargin = -40,
  repeat = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  // Reduced motion → sin animación, contenido visible de una.
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const dur = duration / 1000;
  const del = delay / 1000;
  const viewport = {
    once: !repeat,
    amount: threshold,
    margin: `0px 0px ${rootMargin}px 0px`,
  } as const;

  if (stagger > 0) {
    const container: Variants = {
      hidden: {},
      show: { transition: { staggerChildren: stagger / 1000, delayChildren: del } },
    };
    const item: Variants = {
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: dur, ease: EASE } },
    };
    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {Children.map(children, (child, i) =>
          isValidElement(child) ? (
            <motion.div key={child.key ?? i} variants={item}>
              {child}
            </motion.div>
          ) : (
            child
          ),
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: dur, delay: del, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
