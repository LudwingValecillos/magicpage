"use client";

/**
 * TrustBadges — tira de confianza debajo del hero.
 * 4 ítems icono + label. Datos en site.confianza.
 */

import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

const icons: Record<string, React.ReactNode> = {
  truck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 3h13v13H1zM14 8h4l3 3v5h-7" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  ),
  store: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9 4 4h16l1 5M4 9v11h16V9M4 9h16" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  refresh: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  ),
};

export function TrustBadges() {
  return (
    <section
      aria-label={`Por qué comprar en ${site.brand}`}
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(1.5rem, 4vh, 2.5rem)",
      } as React.CSSProperties}
    >
      <Reveal
        stagger={70}
        y={20}
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {site.confianza.map((b) => (
          <div
            key={b.label}
            className="card flex items-center gap-3 px-4 py-3.5 md:px-5 md:py-4"
          >
            <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)]">
              {icons[b.icon]}
            </span>
            <span className="text-sm md:text-[0.95rem] font-bold text-[var(--color-ink)] leading-tight">
              {b.label}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
