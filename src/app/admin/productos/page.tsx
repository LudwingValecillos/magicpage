"use client";

/**
 * Admin / Productos — full table with filters + bulk-style actions.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProducts } from "@/lib/store/useProducts";

export default function AdminProductsPage() {
  const { all, categories, toggleActive, toggleSale, remove } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "sale">("all");

  const list = useMemo(() => {
    let l = [...all];
    if (cat !== "all") l = l.filter((p) => p.categorySlug === cat);
    if (statusFilter === "active") l = l.filter((p) => p.active);
    if (statusFilter === "inactive") l = l.filter((p) => !p.active);
    if (statusFilter === "sale") l = l.filter((p) => p.onSale);
    if (q.trim()) {
      const needle = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(needle) || p.slug.toLowerCase().includes(needle));
    }
    return l;
  }, [all, cat, statusFilter, q]);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}" del catálogo? Acción irreversible.`)) return;
    await remove(slug);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Productos</span>
          <h1 className="display text-4xl md:text-5xl mt-2">Catálogo</h1>
          <p className="mt-2 text-[var(--color-ivory-dim)]">
            {all.length} productos · {all.filter((p) => p.active).length} visibles · {all.filter((p) => p.onSale).length} en oferta
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)] text-white shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)] hover:shadow-[0_12px_36px_-8px_rgba(96,165,250,0.85)] transition-shadow self-start md:self-auto"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o slug..."
          className="glass rounded-full px-5 py-2.5 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)] outline-none focus:bg-white/10 transition-colors flex-1 min-w-[12rem]"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="glass rounded-full px-5 py-2.5 text-sm text-[var(--color-ivory)] outline-none cursor-pointer"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="glass rounded-full px-5 py-2.5 text-sm text-[var(--color-ivory)] outline-none cursor-pointer"
        >
          <option value="all">Todos</option>
          <option value="active">Solo activos</option>
          <option value="inactive">Solo inactivos</option>
          <option value="sale">Solo en oferta</option>
        </select>
      </div>

      {/* table */}
      <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              <tr>
                <th className="text-left px-4 py-3">Producto</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Estado</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Oferta</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-ivory-mute)]">
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.slug} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="shrink-0 w-10 h-10 rounded-full grid place-items-center text-lg overflow-hidden"
                          style={{ background: `radial-gradient(circle at 30% 30%, ${p.accent}, ${p.accent}66)` }}
                        >
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            p.icon
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className={`font-semibold truncate ${!p.active ? "text-[var(--color-ivory-mute)]" : ""}`}>
                            {p.name}
                          </div>
                          <div className="text-[0.65rem] font-mono text-[var(--color-ivory-mute)]">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--color-ivory-dim)]">{p.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold gradient-text-blue">${p.price.toLocaleString()}</span>
                      {p.onSale && p.oldPrice && (
                        <div className="text-[0.65rem] text-[var(--color-ivory-mute)] line-through">
                          ${p.oldPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <Toggle on={p.active} onChange={() => toggleActive(p.slug)} colorOn="#4DA8FF" />
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <Toggle on={p.onSale} onChange={() => toggleSale(p.slug)} colorOn="#FFD66B" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/productos/${p.slug}`}
                          className="px-3 py-1.5 rounded-full text-xs font-medium glass-blue hover:bg-[var(--color-blue)]/10 transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(p.slug, p.name)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-pink)] hover:bg-[var(--color-pink)]/10 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange, colorOn }: { on: boolean; onChange: () => void; colorOn: string }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${on ? "" : "bg-white/10"}`}
      style={on ? { background: colorOn } : {}}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[1.125rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
