"use client";

/**
 * Hero "Vidriera mágica".
 *
 * Personalidad: titular gigante al centro + personajes reales (badges del CDN
 * de la tienda) flotando alrededor con parallax al mover el mouse e idle-float.
 *
 * Animación de entrada (cascada): arranca cuando IntroCurtain avisa
 * (onIntroReady) — titular palabra por palabra, CTAs, traits y personajes
 * entrando escalonados. Respeta prefers-reduced-motion (todo visible, sin
 * parallax ni float).
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { MagicButton } from "@/components/ui/MagicButton";
import { site } from "@/content/site";
import { onIntroReady } from "@/lib/intro";

const CDN = "https://magicstore.com.ar/wp-content/uploads/2025/06";

/** Personajes reales flotando. depth = px de desplazamiento por parallax. */
const CHARS = [
  { name: "Stitch",      src: `${CDN}/Sin-titulo-2-03-150x150.webp`, color: "#3db5e0", className: "top-[10%] left-[7%] hidden md:block",   size: 104, depth: 34, delay: "0s" },
  { name: "Hello Kitty", src: `${CDN}/hello-kitty-150x150.webp`,      color: "#ff6baa", className: "top-[16%] right-[8%] hidden md:block",  size: 96,  depth: 26, delay: "-1.4s" },
  { name: "Toy Story",   src: `${CDN}/Sin-titulo-2-11-150x150.webp`,  color: "#ffd93d", className: "bottom-[14%] left-[11%] hidden md:block", size: 92, depth: 30, delay: "-2.8s" },
  { name: "Kuromi",      src: `${CDN}/kuromi-150x150.webp`,           color: "#8b5cf6", className: "bottom-[18%] right-[11%] hidden lg:block", size: 90, depth: 22, delay: "-3.6s" },
  { name: "Mickey",      src: `${CDN}/Sin-titulo-2-09-150x150.webp`,  color: "#ff8866", className: "top-[44%] left-[3%] hidden lg:block",   size: 78, depth: 40, delay: "-2s" },
  { name: "Bluey",       src: `${CDN}/bluey-1-150x150.jpg`,           color: "#6bcb77", className: "top-[52%] right-[4%] hidden lg:block",  size: 78, depth: 18, delay: "-4.2s" },
];

// ease-out-quart (mismo cubic-bezier que --ease-out-quart en globals.css)
const EASE = [0.23, 1, 0.32, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const word: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // parallax: mouse relativo al centro (-0.5..0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.4 });

  // parallax de scroll: progreso mientras el hero sale del viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    if (reduce) {
      setStarted(true);
      return;
    }
    return onIntroReady(() => setStarted(true));
  }, [reduce]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const animate = started ? "show" : "hidden";

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 px-[var(--gutter)]"
      style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
    >
      {/* blobs suaves */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[var(--color-sky-soft)]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-[var(--color-pink-soft)]/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] rounded-full bg-[var(--color-yellow)]/25 blur-3xl" />

      {/* personajes flotando */}
      {CHARS.map((c, i) => (
        <Character
          key={c.name}
          char={c}
          sx={sx}
          sy={sy}
          scroll={scrollYProgress}
          started={started}
          index={i}
          reduce={!!reduce}
        />
      ))}

      <motion.div
        className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-5 md:gap-7"
        variants={container}
        initial="hidden"
        animate={animate}
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-sky-tint)] border border-[var(--color-sky-soft)] text-[var(--color-sky-deep)] text-xs font-bold uppercase tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sky)] pulse-soft" />
          {site.hero.eyebrow}
        </motion.span>

        <h1 className="display-tight text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]">
          <span className="block text-[var(--color-ink)]">
            <Words text={site.hero.headline[0]} />
          </span>
          <span className="block gradient-text-happy">
            <Words text={site.hero.headline[1]} />
          </span>
        </h1>

        <motion.p
          variants={item}
          className="max-w-xl text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed px-2"
        >
          {site.hero.sub}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-row items-stretch sm:items-center justify-center gap-3 mt-2 w-full sm:w-auto"
        >
          <MagicButton
            href={site.hero.primaryCta.href}
            variant="primary"
            size="lg"
            icon={<span aria-hidden>→</span>}
            className="flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-7"
          >
            {site.hero.primaryCta.label}
          </MagicButton>
          <MagicButton
            href={site.hero.secondaryCta.href}
            variant="ghost"
            size="lg"
            className="flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-7"
          >
            {site.hero.secondaryCta.label}
          </MagicButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--color-ink-soft)]"
        >
          <Trait icon="✨" text="Productos oficiales" />
          <Trait icon="🚚" text="Envío a coordinar" />
          <Trait icon="💬" text="Atención por WhatsApp" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Titular palabra por palabra (cada palabra es un item del stagger). */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function Character({
  char,
  sx,
  sy,
  scroll,
  started,
  index,
  reduce,
}: {
  char: (typeof CHARS)[number];
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scroll: MotionValue<number>;
  started: boolean;
  index: number;
  reduce: boolean;
}) {
  // mouse parallax
  const x = useTransform(sx, (v) => v * char.depth);
  const y = useTransform(sy, (v) => v * char.depth);
  // scroll parallax: derivan hacia arriba y se desvanecen al salir el hero
  const scrollY = useTransform(scroll, [0, 1], [0, -(80 + char.depth * 2)]);
  const scrollOpacity = useTransform(scroll, [0, 0.85], [1, 0]);

  return (
    // capa 1: entrada (scale/fade)
    <motion.div
      className={`pointer-events-none absolute ${char.className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      animate={started ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: 0.4 + index * 0.1 }}
    >
      {/* capa 2: parallax de scroll */}
      <motion.div style={reduce ? undefined : { y: scrollY, opacity: scrollOpacity }}>
        {/* capa 3: parallax de mouse */}
        <motion.div style={reduce ? undefined : { x, y }}>
          {/* capa 4: idle float + burbuja */}
          <div className="float-soft" style={{ animationDelay: char.delay }}>
            <div
              className="rounded-full grid place-items-center bg-white"
              style={{
                width: char.size,
                height: char.size,
                border: `3px solid ${char.color}55`,
                boxShadow: `0 10px 30px -8px ${char.color}66`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.src}
                alt={char.name}
                loading="eager"
                width={char.size}
                height={char.size}
                className="object-contain"
                style={{ width: char.size * 0.62, height: char.size * 0.62 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Trait({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden>{icon}</span>
      <span className="font-medium">{text}</span>
    </span>
  );
}
