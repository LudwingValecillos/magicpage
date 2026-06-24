"use client";

/**
 * IntroCurtain — cortina de entrada con el logo de Magic.
 *
 * - Se muestra UNA vez por sesión (sessionStorage) y se saltea con
 *   prefers-reduced-motion.
 * - Mientras está visible bloquea el scroll del body.
 * - Al salir (wipe hacia arriba) llama markIntroReady() para que el Hero
 *   arranque su cascada. Si se saltea, marca ready de inmediato.
 *
 * Timeline: logo entra (scale+fade) → sparkle → la cortina se parte y sube →
 * unmount. Total ~1.6s.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { markIntroReady } from "@/lib/intro";

const SEEN_KEY = "magic-intro-seen";
const EASE = [0.76, 0, 0.24, 1] as const;

export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SEEN_KEY);
    if (seen || reduce) {
      markIntroReady();
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setShow(true);
    document.body.style.overflow = "hidden";

    // duración total de la cortina antes de revelar el home
    const t = window.setTimeout(() => setShow(false), 950);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        markIntroReady();
      }}
    >
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            background:
              "linear-gradient(150deg, var(--color-sky) 0%, var(--color-sky-deep) 55%, var(--color-pink-deep) 120%)",
          }}
        >
          {/* blobs suaves de fondo */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[var(--color-yellow)]/25 blur-3xl" />

          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.img
              src="/brand/fantasy-icon.webp"
              alt={process.env.NEXT_PUBLIC_BRAND_NAME}
              className="w-24 h-24 md:w-28 md:h-28 rounded-[1.6rem] bg-[var(--color-bg)] p-1.5 shadow-2xl"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.18 }}
            />
            <span className="font-display text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
              <span className="bg-gradient-to-r from-[var(--color-yellow)] via-white to-[var(--color-pink-soft)] bg-clip-text text-transparent">
                Fantasy
              </span>{" "}
              <span className="text-white">Store</span>
            </span>

            {/* sparkles que estallan */}
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-6 text-xl md:text-2xl"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(angle) * 90,
                    y: Math.sin(angle) * 90,
                    scale: [0, 1.1, 0.6],
                  }}
                  transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
                >
                  ✨
                </motion.span>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
