"use client";

/**
 * Categories — large editorial tiles. First two are XL, rest LG.
 * Stagger-revealed on scroll.
 */

import { Reveal } from "@/components/Reveal";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { site } from "@/content/site";

export function Categories() {
  const [a, b, ...rest] = site.categories;

  return (
    <section
      id="categorias"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal y={32} className="max-w-2xl">
          <span className="eyebrow">Explorá universos</span>
          <h2 className="display text-[clamp(2.25rem,6vw,5rem)] mt-3">
            Encuentra tu <span className="gradient-text">categoría</span> mágica.
          </h2>
        </Reveal>
        <Reveal y={20} className="text-[var(--color-ivory-dim)] text-sm font-mono uppercase tracking-widest">
          08 universos · {site.categories.reduce((a, c) => a + c.count, 0).toLocaleString()} productos
        </Reveal>
      </div>

      <Reveal stagger={120} y={48} className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        <CategoryCard category={a} size="xl" className="col-span-2 md:col-span-3" />
        <CategoryCard category={b} size="xl" className="col-span-2 md:col-span-3" />
        {rest.map((c) => (
          <CategoryCard key={c.slug} category={c} size="lg" className="md:col-span-2" />
        ))}
      </Reveal>
    </section>
  );
}
