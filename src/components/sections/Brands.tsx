"use client";

/**
 * Brands — licensed character showcase.
 * Big horizontal cards (Marvel/Disney/Stitch/Frozen), each with its own
 * brand glow, character emoji and CTA. Stagger reveal on scroll.
 */

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Brands() {
  return (
    <section
      id="brands"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal y={32} className="max-w-2xl">
          <span className="eyebrow">Universos oficiales</span>
          <h2 className="display text-[clamp(2rem,5.5vw,4.5rem)] mt-3 leading-[1]">
            Tus marcas <span className="gradient-text">favoritas</span>.
          </h2>
        </Reveal>
        <Reveal y={20} className="text-[var(--color-ivory-dim)] text-xs font-mono uppercase tracking-widest">
          Productos oficiales · 100% original
        </Reveal>
      </div>

      <Reveal stagger={120} y={48} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {site.brands.map((b) => (
          <Link
            key={b.slug}
            href={`/catalogo?cat=${b.slug}`}
            className="group relative block rounded-[var(--radius-xl)] overflow-hidden h-[18rem] md:h-[22rem]"
            style={{
              background: `linear-gradient(135deg, ${b.bgFrom}, ${b.bgTo})`,
            }}
          >
            {/* brand halo */}
            <div
              className="absolute -inset-32 opacity-50 group-hover:opacity-90 transition-opacity duration-700 blur-[100px]"
              style={{ background: `radial-gradient(circle at 60% 60%, ${b.color}, transparent 60%)` }}
            />

            {/* gradient border accent */}
            <div
              className="absolute inset-0 rounded-[var(--radius-xl)] pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 1px ${b.color}30`,
              }}
            />

            {/* character */}
            <div
              className="absolute right-4 sm:right-8 bottom-2 sm:bottom-4 text-[10rem] sm:text-[14rem] leading-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
              style={{ filter: `drop-shadow(0 20px 40px ${b.color}80)` }}
            >
              {b.icon}
            </div>

            {/* meta */}
            <div className="relative z-10 p-6 md:p-10 max-w-[55%]">
              <span
                className="inline-block text-[0.65rem] font-mono uppercase tracking-widest mb-2 px-2 py-1 rounded-full"
                style={{
                  background: `${b.color}1F`,
                  color: b.color,
                  border: `1px solid ${b.color}55`,
                }}
              >
                {b.tagline}
              </span>
              <h3
                className="display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-ivory)] tracking-tight"
                style={{ textShadow: `0 4px 30px ${b.color}55` }}
              >
                {b.name}
              </h3>
              <span
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 text-sm font-medium text-[var(--color-ivory)] group-hover:gap-3 transition-all duration-500"
                style={{ color: b.color }}
              >
                Ver colección <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
