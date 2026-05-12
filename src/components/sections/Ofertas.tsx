"use client";

/**
 * Ofertas — banda rosada con productos en oferta.
 */

import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { MagicButton } from "@/components/ui/MagicButton";
import { useProducts } from "@/lib/store/useProducts";

export function Ofertas() {
  const { ofertas } = useProducts();
  if (ofertas.length === 0) return null;

  return (
    <section
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3rem, 8vh, 6rem)",
      } as React.CSSProperties}
    >
      <div
        className="max-w-6xl mx-auto rounded-[var(--radius-xl)] p-6 md:p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-pink-tint), var(--color-bg-tint))" }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[var(--color-pink-soft)]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[var(--color-yellow)]/30 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <Reveal y={24}>
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-coral)] text-white text-xs font-bold uppercase tracking-wide">
              Ofertas
            </span>
            <h2 className="display text-[clamp(2rem,5vw,3.25rem)] mt-3">
              Precios <span className="gradient-text-pink">especiales</span>.
            </h2>
          </Reveal>
          <Reveal y={20}>
            <MagicButton href="/catalogo?oferta=1" variant="accent">
              Ver todas
            </MagicButton>
          </Reveal>
        </div>

        <Reveal stagger={80} y={32} className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ofertas.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
