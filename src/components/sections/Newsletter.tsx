"use client";

/**
 * Newsletter — glassy form with glow shadow and gradient submit.
 */

import { Reveal } from "@/components/Reveal";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { site } from "@/content/site";

export function Newsletter() {
  return (
    <section
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(4rem, 10vh, 8rem)",
      } as React.CSSProperties}
    >
      <Reveal y={48}>
        <div className="relative max-w-4xl mx-auto rounded-[var(--radius-xl)] glass-strong px-8 py-14 md:p-16 text-center overflow-hidden">
          <GlowOrb className="absolute -top-32 left-1/2 -translate-x-1/2" color="blue" size={400} blur={140} opacity={0.55} />

          <div className="relative z-10 flex flex-col items-center">
            <span className="eyebrow">{site.newsletter.eyebrow}</span>
            <h2 className="display text-[clamp(1.75rem,4.5vw,3.5rem)] mt-3 max-w-3xl mx-auto leading-tight">
              {site.newsletter.title}
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 w-full max-w-xl flex flex-col sm:flex-row gap-3 p-2 glass rounded-full"
            >
              <input
                type="email"
                placeholder={site.newsletter.placeholder}
                required
                className="flex-1 bg-transparent px-5 py-3 text-base text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)] outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)] shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)] hover:shadow-[0_12px_36px_-8px_rgba(96,165,250,0.85)] transition-shadow"
              >
                {site.newsletter.cta} →
              </button>
            </form>

            <span className="mt-4 text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              {site.newsletter.note}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
