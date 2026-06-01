"use client";

/**
 * Hero — light playful. Soft gradient bg + floating emoji illustrations + copy + CTAs.
 * No canvas. Pure CSS animations (float-soft + pulse-soft).
 */

import { Reveal } from "@/components/Reveal";
import { MagicButton } from "@/components/ui/MagicButton";
import { site } from "@/content/site";

const FLOATIES = [
  { emoji: "🦸", color: "#ff6baa", className: "top-[12%] left-[6%] hidden md:block",  size: 96,  delay: "0s" },
  { emoji: "🏰", color: "#3db5e0", className: "top-[18%] right-[8%] hidden md:block", size: 108, delay: "-1.5s" },
  { emoji: "🧸", color: "#ffd93d", className: "bottom-[14%] left-[10%] hidden md:block", size: 88, delay: "-3s" },
  { emoji: "🪄", color: "#8b5cf6", className: "bottom-[20%] right-[12%] hidden lg:block", size: 92, delay: "-4.5s" },
  { emoji: "⚡", color: "#ff8866", className: "top-[40%] left-[3%] hidden lg:block", size: 72, delay: "-2s" },
  { emoji: "🛡️", color: "#6bcb77", className: "top-[55%] right-[4%] hidden lg:block", size: 72, delay: "-3.5s" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 px-[var(--gutter)]"
      style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
    >
      {/* soft gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[var(--color-sky-soft)]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-[var(--color-pink-soft)]/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] rounded-full bg-[var(--color-yellow)]/25 blur-3xl" />

      {/* floating emoji bubbles */}
      {FLOATIES.map((f, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute ${f.className} float-soft`}
          style={{ animationDelay: f.delay }}
        >
          <div
            className="rounded-full grid place-items-center shadow-[var(--shadow-soft)]"
            style={{
              width: f.size,
              height: f.size,
              background: `radial-gradient(circle at 30% 30%, ${f.color}55, ${f.color}22), white`,
              border: `2px solid ${f.color}44`,
            }}
          >
            <span
              style={{
                fontSize: f.size * 0.55,
                filter: `drop-shadow(0 4px 10px ${f.color}88)`,
              }}
            >
              {f.emoji}
            </span>
          </div>
        </div>
      ))}

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-5 md:gap-7">
        <Reveal y={16}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-sky-tint)] border border-[var(--color-sky-soft)] text-[var(--color-sky-deep)] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sky)] pulse-soft" />
            {site.hero.eyebrow}
          </span>
        </Reveal>

        <Reveal y={24}>
          <h1 className="display-tight text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]">
            <span className="block text-[var(--color-ink)]">{site.hero.headline[0]}</span>
            <span className="block gradient-text-happy">{site.hero.headline[1]}</span>
          </h1>
        </Reveal>

        <Reveal y={20}>
          <p className="max-w-xl text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed px-2">
            {site.hero.sub}
          </p>
        </Reveal>

        <Reveal y={20}>
          <div className="flex flex-row items-stretch sm:items-center justify-center gap-3 mt-2 w-full sm:w-auto">
            <MagicButton href={site.hero.primaryCta.href} variant="primary" size="lg" icon={<span aria-hidden>→</span>} className="flex-1 sm:flex-none">
              {site.hero.primaryCta.label}
            </MagicButton>
            <MagicButton href={site.hero.secondaryCta.href} variant="ghost" size="lg" className="flex-1 sm:flex-none">
              {site.hero.secondaryCta.label}
            </MagicButton>
          </div>
        </Reveal>

        <Reveal y={16}>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--color-ink-soft)]">
            <Trait icon="✨" text="Productos oficiales" />
            <Trait icon="📍" text="Shopping Devoto" />
            <Trait icon="💬" text="Atención por WhatsApp" />
          </div>
        </Reveal>
      </div>
    </section>
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
