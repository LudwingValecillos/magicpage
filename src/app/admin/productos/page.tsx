"use client";

/**
 * Admin / Productos — tabla con filtros + toggles + acciones.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProducts } from "@/lib/store/useProducts";
import type { CategoriaSlug, MarcaSlug } from "@/lib/store/types";

type StatusFilter = "todo" | "activos" | "inactivos" | "oferta";

export default function AdminProductsPage() {
  const { all, categorias, marcas, toggleActivo, toggleOferta, remove } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoriaSlug | "todo">("todo");
  const [marca, setMarca] = useState<MarcaSlug | "todo">("todo");
  const [status, setStatus] = useState<StatusFilter>("todo");

  const list = useMemo(() => {
    let l = [...all];
    if (cat !== "todo") l = l.filter((p) => p.categoria === cat);
    if (marca !== "todo") l = l.filter((p) => p.marca === marca);
    if (status === "activos") l = l.filter((p) => p.activo);
    if (status === "inactivos") l = l.filter((p) => !p.activo);
    if (status === "oferta") l = l.filter((p) => p.oferta);
    if (q.trim()) {
      const n = q.toLowerCase();
      l = l.filter(
        (p) => p.nombre.toLowerCase().includes(n) || p.slug.toLowerCase().includes(n),
      );
    }
    return l.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [all, cat, marca, status, q]);

  const handleDelete = async (slug: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}" del catálogo? Acción irreversible.`)) return;
    await remove(slug);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Productos</span>
          <h1 className="display text-3xl md:text-4xl mt-2 text-[var(--color-ink)]">Catálogo</h1>
          <p className="mt-2 text-[var(--color-ink-soft)]">
            {all.length} productos · {all.filter((p) => p.activo).length} visibles ·{" "}
            {all.filter((p) => p.oferta).length} en oferta
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-5 py-3 rounded-full text-sm font-semibold bg-[var(--color-sky)] text-white shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] transition-colors self-start md:self-auto"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="px-4 py-2 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] outline-none focus:border-[var(--color-sky)] transition-colors flex-1 min-w-[12rem]"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as typeof cat)}
          className="px-4 py-2 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] outline-none cursor-pointer"
        >
          <option value="todo">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value as typeof marca)}
          className="px-4 py-2 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] outline-none cursor-pointer"
        >
          <option value="todo">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="px-4 py-2 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] outline-none cursor-pointer"
        >
          <option value="todo">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
          <option value="oferta">En oferta</option>
        </select>
      </div>

      {/* table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-rule)] text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold bg-[var(--color-bg-tint)]">
              <tr>
                <th className="text-left px-4 py-3">Producto</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Marca</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Activo</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Oferta</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-[var(--color-ink-mute)]"
                  >
                    Sin productos. Creá el primero con el botón &ldquo;+ Nuevo producto&rdquo;.
                  </td>
                </tr>
              ) : (
                list.map((p) => {
                  const cover = p.imagenes[0]?.url;
                  const catInfo = categorias.find((c) => c.slug === p.categoria);
                  return (
                    <tr
                      key={p.slug}
                      className="border-b border-[var(--color-rule)] hover:bg-[var(--color-bg-tint)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 w-10 h-10 rounded-xl bg-[var(--color-bg-tint)] grid place-items-center overflow-hidden">
                            {cover ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={cover}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{catInfo?.emoji ?? "✦"}</span>
                            )}
                          </span>
                          <div className="min-w-0">
                            <div
                              className={`font-semibold truncate ${!p.activo ? "text-[var(--color-ink-mute)]" : "text-[var(--color-ink)]"}`}
                            >
                              {p.nombre}
                            </div>
                            <div className="text-[0.65rem] font-mono text-[var(--color-ink-mute)] truncate">
                              {p.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-[var(--color-ink-soft)]">
                        {catInfo?.nombre ?? p.categoria}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-[var(--color-ink-soft)] capitalize">
                        {p.marca}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-[var(--color-sky-deep)]">
                          ${p.precio.toLocaleString("es-AR")}
                        </span>
                        {p.oferta && p.precioAnterior && (
                          <div className="text-[0.65rem] text-[var(--color-ink-mute)] line-through">
                            ${p.precioAnterior.toLocaleString("es-AR")}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <Toggle
                          on={p.activo}
                          onChange={() => toggleActivo(p.slug)}
                          colorOn="var(--color-sky)"
                        />
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <Toggle
                          on={p.oferta}
                          onChange={() => toggleOferta(p.slug)}
                          colorOn="var(--color-coral)"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/productos/${p.slug}`}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)] hover:bg-[var(--color-sky-soft)]/30 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(p.slug, p.nombre)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--color-pink-deep)] hover:bg-[var(--color-pink-tint)] transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  colorOn,
}: {
  on: boolean;
  onChange: () => void;
  colorOn: string;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${on ? "" : "bg-[var(--color-rule-strong)]"}`}
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
