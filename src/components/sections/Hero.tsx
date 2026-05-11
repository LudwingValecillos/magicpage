"use client";

/**
 * Hero — fullscreen, cinematic.
 * Layers: gradient mesh → particles → ambient glow orbs → 3 floating product
 * orbs (desktop only) → text. Uses anime.js mount sequence for staggered
 * reveal. Mobile hides the floating orbs entirely so the text breathes.
 */

import { useEffect, useRef } from "react";
import { playHeroIntro } from "@/lib/anime/sequences";
import { GradientMesh } from "@/components/visual/GradientMesh";
import { ParticleField } from "@/components/visual/ParticleField";
import { FloatingItem } from "@/components/visual/FloatingItem";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { MagicButton } from "@/components/ui/MagicButton";
import { site } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) playHeroIntro(ref.current);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] md:min-h-[110vh] flex flex-col items-center justify-center overflow-hidden pt-28 md:pt-32 pb-20 md:pb-24 px-5 md:px-6"
    >
      <GradientMesh />
      <ParticleField density={70} hue="mixed" />

      {/* ambient glow orbs (always on) — blue dominant */}
      <GlowOrb className="absolute top-[18%] -left-32" color="blue" size={460} blur={150} opacity={0.55} />
      <GlowOrb className="absolute bottom-[10%] -right-32" color="violet" size={380} blur={140} opacity={0.45} />
      <GlowOrb className="absolute top-[60%] left-[40%]" color="pink" size={280} blur={140} opacity={0.25} />

      {/* floating product orbs — desktop only */}
      <FloatingItem
        className="absolute top-[18%] left-[6%] hidden lg:block"
        delay="0s"
        speed="slow"
        parallax={60}
      >
        <ProductOrb color="#4DA8FF" emoji="🏰" size={140} />
      </FloatingItem>

      <FloatingItem
        className="absolute top-[22%] right-[7%] hidden lg:block"
        delay="-3s"
        speed="fast"
        parallax={80}
      >
        <ProductOrb color="#FF3B3B" emoji="🛡️" size={130} />
      </FloatingItem>

      <FloatingItem
        className="absolute bottom-[16%] left-[10%] hidden lg:block"
        delay="-1.5s"
        speed="slow"
        parallax={50}
      >
        <ProductOrb color="#FF5FA2" emoji="🪄" size={110} />
      </FloatingItem>

      <FloatingItem
        className="absolute bottom-[20%] right-[9%] hidden xl:block"
        delay="-4s"
        speed="fast"
        parallax={70}
      >
        <ProductOrb color="#5BC0EB" emoji="🧸" size={120} />
      </FloatingItem>

      {/* text */}
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center gap-6 md:gap-8">
        <span data-hero="eyebrow" className="opacity-0 eyebrow text-[0.65rem] md:text-xs">
          {site.hero.eyebrow}
        </span>

        <h1 className="display text-[clamp(2.75rem,11vw,9rem)] tracking-tight">
          {site.hero.headline.map((line, i) => {
            const isMid = i === 1;
            return (
              <span
                key={i}
                data-hero="line"
                className={`block opacity-0 will-change-transform ${isMid ? "gradient-text" : "text-[var(--color-ivory)]"}`}
              >
                {line}
                {i === site.hero.headline.length - 1 && <span className="text-[var(--color-pink)]">.</span>}
              </span>
            );
          })}
        </h1>

        <p
          data-hero="meta"
          className="opacity-0 max-w-md md:max-w-xl text-sm md:text-lg text-[var(--color-ivory-dim)] leading-relaxed px-2"
        >
          {site.hero.sub}
        </p>

        <div data-hero="meta" className="opacity-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-2 w-full sm:w-auto">
          <MagicButton href={site.hero.primaryCta.href} variant="primary" size="lg" icon={<span>→</span>}>
            {site.hero.primaryCta.label}
          </MagicButton>
          <MagicButton href={site.hero.secondaryCta.href} variant="ghost" size="lg">
            {site.hero.secondaryCta.label}
          </MagicButton>
        </div>

        {/* stats */}
        <div data-hero="meta" className="opacity-0 mt-8 md:mt-12 flex items-center gap-6 sm:gap-10 md:gap-16 glass rounded-full px-5 sm:px-8 py-3 sm:py-4">
          {site.hero.stats.map((s) => (
            <div key={s.v} className="flex flex-col items-center">
              <span
                className="font-display text-xl sm:text-2xl md:text-3xl gradient-text"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.k}
              </span>
              <span className="text-[0.55rem] sm:text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mt-1">
                {s.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[0.6rem] font-mono uppercase tracking-[0.3em] text-[var(--color-ivory-dim)]">
          Scroll
        </span>
        <span className="w-px h-8 md:h-10 bg-gradient-to-b from-[var(--color-ivory-dim)] to-transparent" />
      </div>
    </section>
  );
}

function ProductOrb({ color, emoji, size }: { color: string; emoji: string; size: number }) {
  return (
    <div
      className="rounded-full grid place-items-center"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}66)`,
        boxShadow: `0 30px 80px -10px ${color}aa, inset 0 -20px 40px rgba(0,0,0,0.35)`,
      }}
    >
      <span className="text-5xl" style={{ filter: `drop-shadow(0 4px 8px ${color})` }}>
        {emoji}
      </span>
    </div>
  );
}
