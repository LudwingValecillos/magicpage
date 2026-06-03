"use client";

/**
 * SideCharacter — personaje decorativo (PNG sin fondo) asomándose al costado,
 * entre secciones, para darle personalidad al home.
 *
 * - Decorativo: aria-hidden, pointer-events-none, no interfiere con el contenido.
 * - Entra animado al hacer scroll (slide desde el costado + leve rotación) e
 *   idle-float continuo.
 * - Solo lg+ (en mobile taparía el contenido).
 * - Si el archivo no existe todavía, se oculta solo (onError) — sin ícono roto.
 *
 * Las imágenes van en public/characters/*.png (PNG/WebP con transparencia,
 * idealmente ~600px de lado, recortadas al personaje).
 */

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

interface SideCharacterProps {
  src: string;
  side: "left" | "right";
  /** ancho en rem para lg / xl */
  width?: string;
  /** clases extra de posición vertical, ej "-top-16" */
  className?: string;
  /** offset horizontal contra el borde. Negativo = se asoma desde afuera
   *  (la parte que sobra se recorta por overflow-x:clip). Ej "-2.5rem". */
  inset?: string;
  /** sin rotación: entra y queda recto (por defecto entra con leve inclinación). */
  straight?: boolean;
  delay?: string;
}

export function SideCharacter({
  src,
  side,
  width = "w-40 xl:w-52",
  className = "",
  inset = "0px",
  straight = false,
  delay = "0s",
}: SideCharacterProps) {
  const reduce = useReducedMotion();
  const isLeft = side === "left";
  const tiltIn = straight ? 0 : isLeft ? -10 : 10;
  const tiltRest = straight ? 0 : isLeft ? -5 : 5;

  return (
    <div
      aria-hidden
      className="relative w-full h-0 hidden md:block pointer-events-none select-none"
    >
      <motion.div
        className={`absolute ${className}`}
        style={isLeft ? { left: inset } : { right: inset }}
        initial={reduce ? false : { opacity: 0, x: isLeft ? -70 : 70, rotate: tiltIn }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0, rotate: tiltRest }}
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div className={reduce ? "" : "float-soft"} style={{ animationDelay: delay }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            className={`${width} h-auto drop-shadow-[0_18px_30px_rgba(28,36,52,0.18)]`}
            onError={(e) => {
              const host = e.currentTarget.closest("[aria-hidden]") as HTMLElement | null;
              if (host) host.style.display = "none";
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
