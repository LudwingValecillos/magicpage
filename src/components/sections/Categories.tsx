"use client";

/**
 * Categories — 3 tiles grandes (ropa, juguetes, accesorios). Cuenta productos por categoría desde el store.
 */

import { Reveal } from "@/components/Reveal";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { useProducts } from "@/lib/store/useProducts";
import { site } from "@/content/site";

export function Categories() {
  const { visibles, categorias } = useProducts();

  return (
    <section
      id="categorias"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(2rem, 6vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        <Reveal y={24} className="text-center mb-10">
          <span className="eyebrow">Categorías</span>
          <h2 className="display text-[clamp(2rem,5vw,3.5rem)] mt-3">
            Buscá por <span className="gradient-text-sky">tipo de producto</span>.
          </h2>
        </Reveal>

        <Reveal stagger={100} y={32} className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
          {(categorias ?? site.categorias).map((c) => {
            const count = visibles.filter((p) => p.categoria === c.slug).length;
            return <CategoryCard key={c.slug} categoria={c} count={count} />;
          })}
        </Reveal>
      </div>
    </section>
  );
}
