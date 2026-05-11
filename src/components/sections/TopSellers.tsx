"use client";

/**
 * TopSellers — horizontal snap carousel from store.
 */

import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProducts } from "@/lib/store/useProducts";

export function TopSellers() {
  const { visible } = useProducts();
  const items = visible.slice(3, 12);

  return (
    <section
      id="top-vendidos"
      className="relative py-[var(--section)]"
      style={{ ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)" } as React.CSSProperties}
    >
      <div
        className="px-[var(--gutter)] mb-10"
        style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <Reveal y={32} className="max-w-2xl">
            <span className="eyebrow">Top vendidos</span>
            <h2 className="display text-[clamp(2.25rem,6vw,5rem)] mt-3">
              Los favoritos del <span className="gradient-text">universo</span>.
            </h2>
          </Reveal>
          <Reveal y={20} className="hidden md:flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              Desliza →
            </span>
          </Reveal>
        </div>
      </div>

      <Reveal y={48}>
        <div
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pl-[var(--gutter)] pr-[var(--gutter)] pb-6"
          style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
        >
          {items.map((p) => (
            <div key={p.slug} className="snap-start shrink-0 w-[18rem] md:w-[22rem]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
