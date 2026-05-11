"use client";

/**
 * Featured — top 6 visible products (admin-managed via store).
 */

import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { MagicButton } from "@/components/ui/MagicButton";
import { useProducts } from "@/lib/store/useProducts";

export function Featured() {
  const { visible } = useProducts();
  const items = visible.slice(0, 6);

  return (
    <section
      id="destacados"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal y={32} className="max-w-2xl">
          <span className="eyebrow">Destacados</span>
          <h2 className="display text-[clamp(2.25rem,6vw,5rem)] mt-3">
            Lo que <span className="gradient-text">brilla</span> esta semana.
          </h2>
        </Reveal>
        <Reveal y={20}>
          <MagicButton href="/catalogo" variant="ghost">
            Ver todo
          </MagicButton>
        </Reveal>
      </div>

      <Reveal stagger={100} y={56} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Reveal>
    </section>
  );
}
