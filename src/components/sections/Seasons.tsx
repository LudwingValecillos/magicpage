"use client";

/**
 * Seasons — themed seasonal collections.
 * Compact 4-card grid (Halloween / Navidad / Verano / Colegio).
 * Active season gets a "live" pulse badge.
 */

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Seasons() {
  return (
    <section
      id="temporadas"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal y={32} className="max-w-2xl">
          <span className="eyebrow">Temporadas</span>
          <h2 className="display text-[clamp(2rem,5.5vw,4.5rem)] mt-3 leading-[1]">
            Cada época, su <span className="gradient-text-blue">colección</span>.
          </h2>
        </Reveal>
        <Reveal y={20} className="text-[var(--color-ivory-dim)] text-xs font-mono uppercase tracking-widest">
          Renovamos cada estación
        </Reveal>
      </div>

      <Reveal stagger={100} y={48} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {site.seasons.map((s) => (
          <Link
            key={s.slug}
            href={`/catalogo?season=${s.slug}`}
            className="group relative block rounded-[var(--radius-lg)] overflow-hidden glass h-[18rem] sm:h-[20rem] md:h-[24rem] transition-all duration-500 hover:-translate-y-2"
          >
            {/* halo */}
            <div
              className="absolute -inset-20 opacity-30 group-hover:opacity-70 transition-opacity duration-700 blur-[80px]"
              style={{ background: `radial-gradient(circle at 50% 50%, ${s.color}, transparent 60%)` }}
            />

            {/* gradient overlay */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                background: `radial-gradient(ellipse at 50% 75%, ${s.color}40, transparent 70%), linear-gradient(180deg, transparent 30%, var(--color-ink) 100%)`,
              }}
            />

            {/* glyph */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                style={{ filter: `drop-shadow(0 20px 40px ${s.color}80)` }}
              >
                {s.icon}
              </span>
            </div>

            {/* live badge */}
            {s.active && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-strong text-[0.6rem] font-mono uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: s.color }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: s.color }} />
                </span>
                Activa
              </div>
            )}

            {/* meta */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
              <h3 className="display text-xl sm:text-2xl md:text-3xl text-[var(--color-ivory)] leading-tight">
                {s.name}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[var(--color-ivory-dim)] truncate">
                {s.sub}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500"
                style={{ color: s.color }}
              >
                Explorar →
              </span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
