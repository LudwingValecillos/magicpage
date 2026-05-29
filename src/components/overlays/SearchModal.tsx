"use client";

/**
 * SearchModal — overlay light con autocomplete sobre productos + categorías.
 * Categorías vienen fijas de site.categorias (no del store).
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store/StoreProvider";
import { site } from "@/content/site";

export function SearchModal() {
  const { searchOpen, closeSearch, products } = useStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    setQ("");
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const productHits = useMemo(() => {
    const visibles = products.filter((p) => p.activo);
    if (!q.trim()) return visibles.slice(0, 6);
    const needle = q.toLowerCase();
    return visibles
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(needle) ||
          p.categoria.toLowerCase().includes(needle) ||
          (p.descripcion ?? "").toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [q, products]);

  const categoryHits = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return site.categorias.filter((c) => c.nombre.toLowerCase().includes(needle));
  }, [q]);

  type Hit =
    | { kind: "category"; slug: string; label: string; emoji: string; color: string }
    | { kind: "product"; slug: string; label: string; emoji: string; color: string; sub: string; price: number; cover?: string };

  const flat = useMemo<Hit[]>(
    () => [
      ...categoryHits.map((c) => ({
        kind: "category" as const,
        slug: c.slug,
        label: c.nombre,
        emoji: c.emoji,
        color: c.color,
      })),
      ...productHits.map((p) => {
        const cat = site.categorias.find((c) => c.slug === p.categoria);
        return {
          kind: "product" as const,
          slug: p.slug,
          label: p.nombre,
          emoji: cat?.emoji ?? "✦",
          color: cat?.color ?? "#3db5e0",
          sub: cat?.nombre ?? p.categoria,
          price: p.precio,
          cover: p.imagenes[0]?.url,
        };
      }),
    ],
    [categoryHits, productHits],
  );

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(flat.length - 1, a + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === "Enter") {
        const hit = flat[active];
        if (hit) {
          window.location.href =
            hit.kind === "category" ? `/catalogo?cat=${hit.slug}` : `/producto/${hit.slug}`;
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch, flat, active]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4"
      onClick={closeSearch}
    >
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-rule)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-rule)]">
          <span className="text-xl" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos, categorías..."
            className="flex-1 bg-transparent outline-none text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)]"
          />
          <kbd className="hidden sm:inline-flex text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] px-2 py-1 rounded bg-[var(--color-bg-tint)] border border-[var(--color-rule)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <span className="text-5xl" aria-hidden>🤷</span>
              <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
                {q.trim() ? `Sin resultados para "${q}".` : "Todavía no hay productos cargados."}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col py-2">
              {flat.map((hit, i) => (
                <li key={`${hit.kind}-${hit.slug}`}>
                  <Link
                    href={
                      hit.kind === "category"
                        ? `/catalogo?cat=${hit.slug}`
                        : `/producto/${hit.slug}`
                    }
                    onClick={closeSearch}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${
                      active === i ? "bg-[var(--color-sky-tint)]" : "hover:bg-[var(--color-bg-tint)]"
                    }`}
                  >
                    <span
                      className="shrink-0 w-10 h-10 rounded-full grid place-items-center text-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${hit.color}33, ${hit.color}11)`,
                      }}
                    >
                      {hit.kind === "product" && hit.cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={hit.cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        hit.emoji
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-[var(--color-ink)] truncate">
                        {hit.label}
                      </span>
                      {hit.kind === "product" && (
                        <span className="block text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)]">
                          {hit.sub}
                        </span>
                      )}
                    </div>
                    {hit.kind === "product" && (
                      <span className="text-sm font-bold text-[var(--color-sky-deep)]">
                        ${hit.price.toLocaleString("es-AR")}
                      </span>
                    )}
                    <span className="text-[var(--color-ink-mute)] text-xs">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="px-5 py-3 border-t border-[var(--color-rule)] flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)]">
          <span>↑ ↓ navegar · ↵ abrir</span>
          <span>
            {flat.length} {flat.length === 1 ? "resultado" : "resultados"}
          </span>
        </footer>
      </div>
    </div>
  );
}
