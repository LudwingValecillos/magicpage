"use client";

/**
 * CatalogView — light, kid-friendly. Filtros por categoría + marca + oferta + búsqueda + sort.
 * Lee productos del store (LocalStorageAdapter hoy, Firestore después).
 * Soporta query params: ?cat=ropa, ?marca=disney, ?oferta=1, ?q=...
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProducts } from "@/lib/store/useProducts";
import type { CategoriaSlug, MarcaSlug, Product } from "@/lib/store/types";

type Sort = "nuevos" | "precio-asc" | "precio-desc";

export function CatalogView() {
  const params = useSearchParams();
  const { visibles, categorias, marcas } = useProducts();

  const [cat, setCat] = useState<CategoriaSlug | "todo">("todo");
  const [marca, setMarca] = useState<MarcaSlug | "todo">("todo");
  const [oferta, setOferta] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("nuevos");

  useEffect(() => {
    const c = params?.get("cat");
    if (c === "ropa" || c === "juguetes" || c === "accesorios") setCat(c);
    const m = params?.get("marca");
    if (m === "disney" || m === "marvel" || m === "otra") setMarca(m);
    if (params?.get("oferta") === "1") setOferta(true);
    const q = params?.get("q");
    if (q) setQuery(q);
  }, [params]);

  const filtered = useMemo<Product[]>(() => {
    let list = [...visibles];
    if (cat !== "todo") list = list.filter((p) => p.categoria === cat);
    if (marca !== "todo") list = list.filter((p) => p.marca === marca);
    if (oferta) list = list.filter((p) => p.oferta);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion ?? "").toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "precio-asc":
        list.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        list.sort((a, b) => b.precio - a.precio);
        break;
      case "nuevos":
      default:
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }
    return list;
  }, [visibles, cat, marca, oferta, query, sort]);

  return (
    <section
      className="relative px-[var(--gutter)] pb-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3rem, 8vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <Reveal y={24} className="max-w-2xl">
            <span className="eyebrow">Catálogo</span>
            <h1 className="display text-[clamp(2.25rem,6vw,4rem)] mt-3">
              Todos nuestros <span className="gradient-text-sky">productos</span>.
            </h1>
          </Reveal>
          <Reveal y={16} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="search"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 md:w-64 md:flex-none px-4 py-2.5 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] outline-none focus:border-[var(--color-sky)] transition-colors"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="px-4 py-2.5 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] outline-none cursor-pointer hover:border-[var(--color-sky)] transition-colors shrink-0"
            >
              <option value="nuevos">Más nuevos</option>
              <option value="precio-asc">Precio ↑</option>
              <option value="precio-desc">Precio ↓</option>
            </select>
          </Reveal>
        </div>

        {/* chips */}
        <Reveal y={16}>
          <div className="-mx-[var(--gutter)] px-[var(--gutter)] overflow-x-auto no-scrollbar mb-3">
            <div className="flex gap-2 w-max">
              <Chip label="Todo" active={cat === "todo"} onClick={() => setCat("todo")} />
              {categorias.map((c) => (
                <Chip
                  key={c.slug}
                  label={`${c.emoji} ${c.nombre}`}
                  active={cat === c.slug}
                  onClick={() => setCat(c.slug)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip label="Marca: todas" active={marca === "todo"} onClick={() => setMarca("todo")} small />
            {marcas.map((m) => (
              <Chip
                key={m.slug}
                label={m.nombre}
                active={marca === m.slug}
                onClick={() => setMarca(m.slug)}
                small
              />
            ))}
            <Chip
              label="Solo ofertas"
              active={oferta}
              onClick={() => setOferta((v) => !v)}
              small
            />
          </div>
        </Reveal>

        {/* count */}
        <div className="mt-6 mb-4 text-sm text-[var(--color-ink-mute)]">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
        </div>

        {/* grid */}
        {filtered.length === 0 ? (
          <Reveal y={24}>
            <div className="card p-10 sm:p-16 text-center">
              <span className="text-5xl sm:text-6xl">🔍</span>
              <p className="mt-4 text-[var(--color-ink-soft)]">
                Sin resultados. Probá con otra categoría o sacá los filtros.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal stagger={60} y={32} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Chip({
  label,
  active,
  onClick,
  small = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      data-active={active || undefined}
      className={`chip shrink-0 whitespace-nowrap ${small ? "text-xs px-3 py-1.5" : ""}`}
    >
      {label}
    </button>
  );
}
