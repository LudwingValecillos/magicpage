"use client";

/**
 * AmbientBackground — capa decorativa fija detrás de todo el sitio.
 *
 * - Blobs de color suaves que derivan lento (CSS .drift) y se mueven con el
 *   scroll a distinta velocidad (parallax con framer useScroll → useTransform).
 * - Estrellitas que titilan (.twinkle).
 * - pointer-events-none, z negativo: nunca tapa ni intercepta el contenido.
 * - Respeta prefers-reduced-motion: queda estático (sin parallax ni deriva).
 *
 * Va montado una vez en layout.tsx, encima del gradiente base del body.
 */

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const BLOBS = [
  { color: "var(--color-sky-soft)",  className: "top-[-8%] left-[-6%] w-[34rem] h-[34rem]",   opacity: 0.4,  drift: -160, delay: "0s" },
  { color: "var(--color-pink-soft)", className: "top-[28%] right-[-10%] w-[30rem] h-[30rem]",  opacity: 0.38, drift: 220,  delay: "-6s" },
  { color: "var(--color-yellow)",    className: "top-[62%] left-[-4%] w-[26rem] h-[26rem]",    opacity: 0.28, drift: -120, delay: "-12s" },
  { color: "#8b5cf6",                className: "top-[88%] right-[6%] w-[28rem] h-[28rem]",     opacity: 0.22, drift: 180,  delay: "-18s" },
];

export function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Cada estrellita con posición/tamaño/timing estables entre renders.
  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53 + 7) % 97}%`,
        top: `${(i * 71 + 11) % 95}%`,
        size: 6 + ((i * 13) % 10),
        delay: `${-(i % 7) * 0.6}s`,
        dur: `${3.5 + (i % 5) * 0.7}s`,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <Blob key={i} blob={b} progress={scrollYProgress} reduce={!!reduce} />
      ))}

      {!reduce &&
        stars.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.dur,
              background:
                i % 3 === 0
                  ? "var(--color-pink)"
                  : i % 3 === 1
                    ? "var(--color-sky)"
                    : "var(--color-yellow-deep)",
              boxShadow: "0 0 8px currentColor",
            }}
          />
        ))}
    </div>
  );
}

function Blob({
  blob,
  progress,
  reduce,
}: {
  blob: (typeof BLOBS)[number];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const y = useTransform(progress, [0, 1], [0, blob.drift]);
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${blob.className}`}
      style={{
        opacity: blob.opacity,
        ...(reduce ? {} : { y }),
      }}
    >
      <div
        className={`${reduce ? "" : "drift"} w-full h-full rounded-full`}
        style={{ background: blob.color, animationDelay: blob.delay }}
      />
    </motion.div>
  );
}
