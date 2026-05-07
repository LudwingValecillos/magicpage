"use client";

/**
 * PromoBanner — cinematic full-width promo block.
 * Big poster glyph + giant typography + animated mesh.
 */

import { Reveal } from "@/components/Reveal";
import { GradientMesh } from "@/components/visual/GradientMesh";
import { ParticleField } from "@/components/visual/ParticleField";
import { FloatingItem } from "@/components/visual/FloatingItem";
import { MagicButton } from "@/components/ui/MagicButton";
import { site } from "@/content/site";

export function PromoBanner() {
  return (
    <section
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <Reveal y={48}>
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] glass-strong px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-24 min-h-[24rem] md:min-h-[28rem] flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
          <GradientMesh variant="hero" />
          <ParticleField density={40} hue="mixed" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="eyebrow">{site.promo.eyebrow}</span>
            <h2 className="display text-[clamp(2.25rem,7vw,6rem)] mt-3 leading-[0.95]">
              <span className="gradient-text">{site.promo.title}</span>
            </h2>
            <p className="mt-5 md:mt-6 text-sm md:text-lg text-[var(--color-ivory-dim)] max-w-md mx-auto md:mx-0">
              {site.promo.sub}
            </p>
            <div className="mt-7 md:mt-8 flex justify-center md:justify-start">
              <MagicButton href={site.promo.cta.href} variant="primary" size="lg" icon={<span>✦</span>}>
                {site.promo.cta.label}
              </MagicButton>
            </div>
          </div>

          <div className="relative z-10">
            <FloatingItem speed="slow">
              <div
                className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full grid place-items-center spin-slow"
                style={{
                  background: "conic-gradient(from 0deg, #FF3D9A, #8A5BFF, #3DCBFF, #FF3D9A)",
                  filter: "blur(0.5px)",
                }}
              >
                <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full bg-[var(--color-ink)] grid place-items-center text-[6rem] sm:text-[8rem] md:text-[10rem]">
                  {site.promo.poster}
                </div>
              </div>
            </FloatingItem>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
