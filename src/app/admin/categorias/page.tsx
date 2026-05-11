"use client";

/**
 * Admin / Categorías — inline CRUD.
 */

import { useState } from "react";
import { useStore } from "@/lib/store/StoreProvider";
import { useProducts } from "@/lib/store/useProducts";
import type { Category } from "@/lib/store/types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export default function AdminCategoriesPage() {
  const { categories, setCategories } = useStore();
  const { all: products } = useProducts();
  const [draft, setDraft] = useState({ slug: "", name: "", icon: "✦", color: "#4DA8FF" });
  const [error, setError] = useState<string | null>(null);

  const counts = (slug: string) => products.filter((p) => p.categorySlug === slug).length;

  const add = async () => {
    setError(null);
    if (!draft.name.trim()) return setError("Nombre requerido.");
    const slug = draft.slug.trim() || slugify(draft.name);
    if (categories.some((c) => c.slug === slug)) return setError("Slug duplicado.");
    const next: Category = { slug, name: draft.name.trim(), icon: draft.icon || "✦", color: draft.color, count: 0 };
    await setCategories([...categories, next]);
    setDraft({ slug: "", name: "", icon: "✦", color: "#4DA8FF" });
  };

  const updateField = async (slug: string, patch: Partial<Category>) => {
    const next = categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c));
    await setCategories(next);
  };

  const remove = async (slug: string) => {
    const used = counts(slug);
    if (used > 0) {
      alert(`Esta categoría tiene ${used} productos. Reasigna o elimina esos productos primero.`);
      return;
    }
    if (!confirm("¿Eliminar categoría?")) return;
    await setCategories(categories.filter((c) => c.slug !== slug));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Categorías</span>
        <h1 className="display text-4xl md:text-5xl mt-2">Secciones del catálogo</h1>
        <p className="mt-2 text-[var(--color-ivory-dim)]">Crear, editar y eliminar las secciones de la tienda.</p>
      </div>

      {/* new category */}
      <div className="glass rounded-[var(--radius-lg)] p-5 mb-8">
        <h3 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mb-3">
          Nueva categoría
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto_auto] gap-3 items-center">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: slugify(e.target.value) })}
            placeholder="Nombre"
            className="adminput"
          />
          <input
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            placeholder="slug"
            className="adminput font-mono"
          />
          <input
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            maxLength={4}
            className="adminput w-16 text-center text-xl"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={draft.color}
              onChange={(e) => setDraft({ ...draft, color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
            />
            <button
              onClick={add}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--color-blue-deep)] to-[var(--color-blue)] text-white shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)]"
            >
              + Crear
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 text-sm text-[var(--color-pink)] bg-[var(--color-pink)]/10 border border-[var(--color-pink)]/30 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}
      </div>

      {/* list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div key={c.slug} className="glass rounded-[var(--radius-lg)] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-full grid place-items-center text-xl shrink-0"
                style={{ background: `radial-gradient(circle at 30% 30%, ${c.color}, ${c.color}55)` }}
              >
                {c.icon}
              </span>
              <div className="min-w-0">
                <input
                  value={c.name}
                  onChange={(e) => updateField(c.slug, { name: e.target.value })}
                  className="adminput-inline font-semibold"
                />
                <span className="block text-[0.65rem] font-mono text-[var(--color-ivory-mute)] mt-0.5">
                  {c.slug} · {counts(c.slug)} productos
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={c.icon}
                onChange={(e) => updateField(c.slug, { icon: e.target.value })}
                maxLength={4}
                className="adminput w-14 text-center"
              />
              <input
                type="color"
                value={c.color}
                onChange={(e) => updateField(c.slug, { color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
              />
              <button
                onClick={() => remove(c.slug)}
                className="ml-auto px-3 py-1.5 rounded-full text-xs text-[var(--color-pink)] hover:bg-[var(--color-pink)]/10 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        :global(.adminput) {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          color: var(--color-ivory);
          font-size: 0.875rem;
          outline: none;
          transition: background 0.2s, border-color 0.2s;
        }
        :global(.adminput::placeholder) { color: var(--color-ivory-mute); }
        :global(.adminput:focus) {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--color-blue);
        }
        :global(.adminput-inline) {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          padding: 0.125rem 0.375rem;
          color: var(--color-ivory);
          font-size: 0.95rem;
          outline: none;
          width: 100%;
        }
        :global(.adminput-inline:focus) {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--color-blue);
        }
      `}</style>
    </div>
  );
}
