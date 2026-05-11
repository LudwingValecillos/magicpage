"use client";

/**
 * SearchModal — fullscreen blur overlay with live autocomplete over the
 * product catalog + categories. Keyboard navigable (↑/↓/Enter/Escape).
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store/StoreProvider";

export function SearchModal() {
  const { searchOpen, closeSearch, products, categories } = useStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // open: focus + reset
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

  // results
  const productHits = useMemo(() => {
    if (!q.trim()) return products.filter((p) => p.active).slice(0, 6);
    const needle = q.toLowerCase();
    return products
      .filter((p) => p.active)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [q, products]);

  const categoryHits = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4);
  }, [q, categories]);

  const flat = useMemo(
    () => [
      ...categoryHits.map((c) => ({ kind: "category" as const, slug: c.slug, label: c.name, icon: c.icon, color: c.color })),
      ...productHits.map((p) => ({ kind: "product" as const, slug: p.slug, label: p.name, icon: p.icon, color: p.accent, sub: p.category, price: p.price })),
    ],
    [categoryHits, productHits],
  );

  // keyboard nav
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
          window.location.href = hit.kind === "category" ? `/catalogo?cat=${hit.slug}` : `/producto/${hit.slug}`;
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch, flat, active]);

  // reset highlight when results change
  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4"
      onClick={closeSearch}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl glass-strong rounded-[var(--radius-lg)] overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        {/* search field */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <span className="text-xl">🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos, categorías..."
            className="flex-1 bg-transparent outline-none text-lg text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)]"
          />
          <kbd className="hidden sm:inline-flex text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] px-2 py-1 rounded glass">
            ESC
          </kbd>
        </div>

        {/* results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <span className="text-5xl">✦</span>
              <p className="mt-3 text-sm text-[var(--color-ivory-dim)]">
                Sin resultados para &ldquo;{q}&rdquo;.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col py-2">
              {categoryHits.length > 0 && (
                <SectionHeader label="Categorías" />
              )}
              {flat.map((hit, i) => (
                <li key={`${hit.kind}-${hit.slug}`}>
                  {hit.kind === "category" ? (
                    <SectionHeaderInline show={i === 0 && categoryHits.length > 0} />
                  ) : null}
                  {hit.kind === "product" && i === categoryHits.length && categoryHits.length > 0 && (
                    <SectionHeaderInline show forceLabel="Productos" />
                  )}
                  {i === 0 && categoryHits.length === 0 && hit.kind === "product" && q.trim() === "" && (
                    <SectionHeaderInline show forceLabel="Sugeridos" />
                  )}

                  <Link
                    href={hit.kind === "category" ? `/catalogo?cat=${hit.slug}` : `/producto/${hit.slug}`}
                    onClick={closeSearch}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${
                      active === i ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="shrink-0 w-10 h-10 rounded-full grid place-items-center text-xl"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${hit.color}, ${hit.color}55)`,
                      }}
                    >
                      {hit.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-[var(--color-ivory)] truncate">
                        {hit.label}
                      </span>
                      {hit.kind === "product" && (
                        <span className="block text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
                          {hit.sub}
                        </span>
                      )}
                    </div>
                    {hit.kind === "product" && (
                      <span className="text-sm font-semibold gradient-text-blue">
                        ${hit.price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[var(--color-ivory-mute)] text-xs">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* hint footer */}
        <footer className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
          <span>↑ ↓ navegar · ↵ abrir</span>
          <span>{flat.length} resultados</span>
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <li className="px-5 py-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
      {label}
    </li>
  );
}
function SectionHeaderInline({ show, forceLabel }: { show: boolean; forceLabel?: string }) {
  if (!show) return null;
  return (
    <div className="px-5 py-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
      {forceLabel ?? ""}
    </div>
  );
}
