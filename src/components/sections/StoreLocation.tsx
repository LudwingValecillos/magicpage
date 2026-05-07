"use client";

/**
 * StoreLocation — emotional storytelling block about the physical store.
 * Two-column: copy + visual (stylized storefront).
 */

import { Reveal } from "@/components/Reveal";
import { ParallaxText } from "@/components/ParallaxText";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { MagicButton } from "@/components/ui/MagicButton";
import { site } from "@/content/site";

export function StoreLocation() {
  return (
    <section
      id="local"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* visual */}
        <div className="lg:col-span-7 relative">
          <Reveal y={64}>
            <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden glass-strong">
              <GlowOrb className="absolute -top-20 -left-20" color="pink" size={300} blur={120} opacity={0.6} />
              <GlowOrb className="absolute -bottom-20 -right-20" color="blue" size={300} blur={120} opacity={0.5} />

              {/* stylized storefront */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative">
                  <div className="text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none drop-shadow-[0_20px_40px_rgba(255,61,154,0.5)]">🏪</div>
                  <ParallaxText className="absolute -top-4 -right-4 md:-top-8 md:-right-8" distance={60}>
                    <span className="text-3xl sm:text-5xl md:text-6xl float-slow">✦</span>
                  </ParallaxText>
                  <ParallaxText className="absolute bottom-2 -left-6 md:bottom-4 md:-left-12" distance={80}>
                    <span className="text-3xl sm:text-4xl md:text-5xl float">🪄</span>
                  </ParallaxText>
                </div>
              </div>

              {/* floating info chips */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 glass rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[0.65rem] md:text-xs font-mono uppercase tracking-widest">
                ◉ Abierto ahora
              </div>
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 glass rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-[0.65rem] md:text-xs max-w-[60%]">
                <div className="font-semibold text-[var(--color-ivory)] truncate">{site.store.address}</div>
                <div className="text-[var(--color-ivory-dim)] mt-0.5 md:mt-1 truncate">{site.store.hours}</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* copy */}
        <div className="lg:col-span-5">
          <Reveal y={32}>
            <span className="eyebrow">— {site.store.label}</span>
          </Reveal>
          <Reveal y={48} duration={1100}>
            <h2 className="display text-[clamp(2rem,5vw,4rem)] mt-3 leading-tight">
              {site.store.title}
            </h2>
          </Reveal>
          <Reveal y={32} delay={150}>
            <p className="mt-6 text-[var(--color-ivory-dim)] text-base md:text-lg leading-relaxed max-w-md">
              {site.store.body}
            </p>
          </Reveal>
          <Reveal y={20} delay={250} stagger={80} className="mt-8 flex flex-col gap-3">
            <InfoLine label="Dirección" value={site.store.address} />
            <InfoLine label="Horario" value={site.store.hours} />
            <InfoLine label="Teléfono" value={site.store.phone} />
          </Reveal>
          <Reveal y={20} delay={400} className="mt-8">
            <MagicButton href={site.store.cta.href} variant="primary" icon={<span>↗</span>}>
              {site.store.cta.label}
            </MagicButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--color-rule)]">
      <span className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
        {label}
      </span>
      <span className="text-sm text-[var(--color-ivory)]">{value}</span>
    </div>
  );
}
