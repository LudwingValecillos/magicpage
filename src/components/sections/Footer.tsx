"use client";

/**
 * Footer — premium colophon. Brand block + 4 link columns + socials + legal.
 */

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer
      className="relative px-[var(--gutter)] pt-24 pb-10 mt-12 border-t border-[var(--color-rule)]"
      style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
    >
      <Reveal y={32} className="grid grid-cols-2 md:grid-cols-6 gap-10">
        {/* brand */}
        <div className="col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-violet)] to-[var(--color-pink)] grid place-items-center text-lg shadow-[0_0_24px_rgba(77,168,255,0.7)] group-hover:rotate-12 transition-transform">
              ✦
            </span>
            <span className="font-display text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {site.brand}
            </span>
          </Link>
          <p className="mt-4 text-sm text-[var(--color-ivory-dim)] max-w-xs leading-relaxed">
            Una experiencia mágica para niños y padres. Curado con cariño desde 2026.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {site.footer.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full glass grid place-items-center text-xs font-mono hover:bg-white/10 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* columns */}
        {site.footer.cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mb-4">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-ivory-dim)] hover:text-[var(--color-blue)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      <Reveal y={16} delay={200} className="mt-16 pt-6 border-t border-[var(--color-rule)] flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
          {site.footer.legal}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
          Hecho con <span className="text-[var(--color-blue)]">♥</span> en 2026
        </span>
      </Reveal>
    </footer>
  );
}
