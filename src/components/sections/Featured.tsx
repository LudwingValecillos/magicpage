"use client";

/**
 * Destacados — primeros 6 productos visibles ordenados por más nuevos.
 */

import { useMemo } from "react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { MagicButton } from "@/components/ui/MagicButton";
import { useProducts } from "@/lib/store/useProducts";

export function Featured() {
  const { visibles } = useProducts();
  // El hero promete productos con licencia (Disney/Marvel). Priorizamos esos
  // por sobre los genéricos (marca "otra"), y dentro de cada grupo, los más nuevos.
  // TODO: cuando exista un flag real de personaje/licencia en el schema, usar
  // ese campo en lugar de `marca !== "otra"`.
  const items = useMemo(() => {
    const licenciado = (m: string) => (m === "otra" ? 1 : 0);
    return [...visibles]
      .sort(
        (a, b) =>
          licenciado(a.marca) - licenciado(b.marca) ||
          (b.createdAt ?? 0) - (a.createdAt ?? 0),
      )
      .slice(0, 6);
  }, [visibles]);

  if (items.length === 0) return null;

  return (
    <section
      id="destacados"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(2rem, 6vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <Reveal y={32} className="max-w-2xl">
            <span className="eyebrow eyebrow-pink">Destacados</span>
            <h2 className="display text-[clamp(2rem,5vw,3.5rem)] mt-3">
              Lo más <span className="gradient-text-pink">nuevo</span>.
            </h2>
          </Reveal>
          <Reveal y={20}>
            <MagicButton href="/catalogo" variant="ghost">
              Ver todo
            </MagicButton>
          </Reveal>
        </div>

        <Reveal stagger={80} y={40} className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
