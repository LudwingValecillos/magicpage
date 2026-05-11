"use client";

/**
 * CatalogView — interactive catalog. Reads products + categories from the
 * store (LocalStorageAdapter today, Supabase later) so admin edits are live.
 */

import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { GradientMesh } from "@/components/visual/GradientMesh";
import { useProducts } from "@/lib/store/useProducts";
import type { Product } from "@/lib/store/types";

type Sort = "destacado" | "precio-asc" | "precio-desc" | "rating";

export function CatalogView() {
  const { visible: products, categories } = useProducts();
  const [active, setActive] = useState<string | "todo">("todo");
  const [sort, setSort] = useState<Sort>("destacado");
  const [query, setQuery] = useState("");

  const filtered = useMemo<Product[]>(() => {
    let list: Product[] = [...products];
    if (active !== "todo") list = list.filter((p) => p.categorySlug === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sort) {
      case "precio-asc": list.sort((a, b) => a.price - b.price); break;
      case "precio-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [active, sort, query, products]);

  return (
    <section
      className="relative px-[var(--gutter)] pb-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <GradientMesh variant="soft" />

      {/* header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <Reveal y={32} className="max-w-2xl">
          <span className="eyebrow">Catálogo</span>
          <h1 className="display text-[clamp(2.5rem,7vw,6rem)] mt-3">
            Todo el <span className="gradient-text">universo</span>.
          </h1>
        </Reveal>
        <Reveal y={20} className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="search"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="glass rounded-full px-4 md:px-5 py-3 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)] outline-none focus:bg-white/10 transition-colors flex-1 md:w-64 md:flex-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="glass rounded-full px-4 md:px-5 py-3 text-sm text-[var(--color-ivory)] outline-none cursor-pointer hover:bg-white/10 transition-colors shrink-0"
          >
            <option value="destacado">Destacados</option>
            <option value="precio-asc">Precio ↑</option>
            <option value="precio-desc">Precio ↓</option>
            <option value="rating">Mejor rating</option>
          </select>
        </Reveal>
      </div>

      {/* mobile filter chips */}
      <div className="lg:hidden -mx-[var(--gutter)] mb-6 px-[var(--gutter)] overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          <ChipFilter label="Todo" active={active === "todo"} onClick={() => setActive("todo")} />
          {categories.map((c) => {
            const count = products.filter((p) => p.categorySlug === c.slug).length;
            if (count === 0) return null;
            return (
              <ChipFilter
                key={c.slug}
                label={`${c.icon} ${c.name}`}
                active={active === c.slug}
                onClick={() => setActive(c.slug)}
              />
            );
          })}
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* desktop sidebar */}
        <Reveal y={24} className="hidden lg:block lg:col-span-3">
          <aside className="glass rounded-[var(--radius-lg)] p-6 sticky top-28">
            <h3 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mb-4">
              Categorías
            </h3>
            <ul className="flex flex-col gap-1">
              <FilterItem label="Todo" count={products.length} active={active === "todo"} onClick={() => setActive("todo")} />
              {categories.map((c) => {
                const count = products.filter((p) => p.categorySlug === c.slug).length;
                if (count === 0) return null;
                return (
                  <FilterItem
                    key={c.slug}
                    label={`${c.icon}  ${c.name}`}
                    count={count}
                    active={active === c.slug}
                    onClick={() => setActive(c.slug)}
                  />
                );
              })}
            </ul>

            <div className="mt-8 pt-6 border-t border-[var(--color-rule)]">
              <h3 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mb-4">
                Resultados
              </h3>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl gradient-text-blue" style={{ fontFamily: "var(--font-display)" }}>
                  {filtered.length}
                </span>
                <span className="text-sm text-[var(--color-ivory-dim)] mb-1">productos</span>
              </div>
            </div>
          </aside>
        </Reveal>

        {/* grid */}
        <div className="lg:col-span-9">
          <div className="lg:hidden mb-4 text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
          </div>

          {filtered.length === 0 ? (
            <Reveal y={24}>
              <div className="glass rounded-[var(--radius-lg)] p-10 sm:p-16 text-center">
                <span className="text-5xl sm:text-6xl">✦</span>
                <p className="mt-4 text-[var(--color-ivory-dim)]">Sin resultados. Probá con otra categoría.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal stagger={70} y={48} className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function ChipFilter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-gradient-to-r from-[var(--color-blue-deep)] to-[var(--color-blue)] text-white shadow-[0_4px_16px_-4px_rgba(77,168,255,0.6)]"
          : "glass text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)]"
      }`}
    >
      {label}
    </button>
  );
}

function FilterItem({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm transition-all ${
          active
            ? "bg-gradient-to-r from-[var(--color-blue)]/20 to-[var(--color-violet)]/20 text-[var(--color-ivory)] border border-[var(--color-blue)]/40"
            : "text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5"
        }`}
      >
        <span>{label}</span>
        <span className="text-xs font-mono text-[var(--color-ivory-mute)]">{count}</span>
      </button>
    </li>
  );
}
