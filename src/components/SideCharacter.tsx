"use client";

/**
 * SideCharacter — personaje decorativo (PNG sin fondo) asomándose al costado,
 * entre secciones, para darle personalidad al home.
 *
 * - Decorativo: aria-hidden, pointer-events-none, no interfiere con el contenido.
 * - Entra animado al hacer scroll (slide desde el costado + leve rotación) e
 *   idle-float continuo.
 * - Por defecto solo md+ (en mobile taparía el contenido). Con `mobile` se puede
 *   mostrar también en mobile, eligiendo lado (`mobileSide`) y espejado
 *   (`mobileMirror`) — útil cuando la figura "apunta" a un lado y conviene
 *   invertirla para que mire al centro.
 * - Si el archivo no existe todavía, se oculta solo (onError) — sin ícono roto.
 *
 * Las imágenes van en public/characters/*.png (PNG/WebP con transparencia,
 * idealmente ~600px de lado, recortadas al personaje).
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

interface SideCharacterProps {
  src: string;
  side: "left" | "right";
  /** ancho, ej "w-40 xl:w-52" */
  width?: string;
  /** clases extra de posición vertical, ej "-top-16" */
  className?: string;
  /** clases verticales propias para mobile (default = className) */
  mobileClassName?: string;
  /** offset horizontal contra el borde. Negativo = se asoma desde afuera
   *  (la parte que sobra se recorta por overflow-x:clip). Ej "-2.5rem". */
  inset?: string;
  /** sin rotación: entra y queda recto (por defecto entra con leve inclinación). */
  straight?: boolean;
  /** mostrar también en mobile (<768px). Default false = oculto en mobile. */
  mobile?: boolean;
  /** lado en mobile (default = side). */
  mobileSide?: "left" | "right";
  /** espejar horizontalmente en mobile. */
  mobileMirror?: boolean;
  delay?: string;
}

export function SideCharacter({
  src,
  side,
  width = "w-40 xl:w-52",
  className = "",
  mobileClassName,
  inset = "0px",
  straight = false,
  mobile = false,
  mobileSide,
  mobileMirror = false,
  delay = "0s",
}: SideCharacterProps) {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // En mobile, solo se muestra si mobile=true.
  if (isMobile && !mobile) return null;

  const activeSide = isMobile && mobileSide ? mobileSide : side;
  const isLeft = activeSide === "left";
  const mirror = isMobile && mobileMirror;
  const vClass = isMobile ? mobileClassName ?? className : className;
  const tiltIn = straight ? 0 : isLeft ? -10 : 10;
  const tiltRest = straight ? 0 : isLeft ? -5 : 5;

  return (
    <div
      aria-hidden
      className="relative w-full h-0 block pointer-events-none select-none"
    >
      <motion.div
        className={`absolute ${vClass}`}
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
            style={mirror ? { transform: "scaleX(-1)" } : undefined}
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
