"use client";

/**
 * <ProductForm> — used by both /admin/productos/nuevo and
 * /admin/productos/[slug]. Edits all writable fields on a Product, including
 * the images[] array (URL inputs with reorder + remove).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/store/useProducts";
import type { BadgeKind, Product } from "@/lib/store/types";

interface ProductFormProps {
  initial?: Product;
}

const ALL_BADGES: BadgeKind[] = ["new", "hot", "sale", "exclusive"];

function emptyDraft(): Product {
  return {
    slug: "",
    name: "",
    category: "",
    categorySlug: "",
    price: 0,
    oldPrice: undefined,
    rating: 5,
    badges: [],
    icon: "✦",
    accent: "#4DA8FF",
    description: "",
    details: [],
    images: [],
    active: true,
    onSale: false,
  };
}

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

export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const { categories, create, update, all } = useProducts();
  const isEdit = Boolean(initial);

  const [draft, setDraft] = useState<Product>(initial ?? emptyDraft());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [detailInput, setDetailInput] = useState("");

  // auto-slug from name when creating
  useEffect(() => {
    if (isEdit) return;
    setDraft((d) => ({ ...d, slug: slugify(d.name) }));
  }, [draft.name, isEdit]);

  const setField = <K extends keyof Product>(k: K, v: Product[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const onCategoryChange = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    setDraft((d) => ({ ...d, categorySlug: slug, category: c?.name ?? "", accent: c?.color ?? d.accent }));
  };

  const toggleBadge = (b: BadgeKind) => {
    const has = draft.badges?.includes(b);
    const next = has ? (draft.badges ?? []).filter((x) => x !== b) : [...(draft.badges ?? []), b];
    setField("badges", next);
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setField("images", [...draft.images, url]);
    setImageInput("");
  };
  const removeImage = (i: number) => setField("images", draft.images.filter((_, idx) => idx !== i));
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.images.length) return;
    const next = [...draft.images];
    [next[i], next[j]] = [next[j], next[i]];
    setField("images", next);
  };

  const addDetail = () => {
    const t = detailInput.trim();
    if (!t) return;
    setField("details", [...draft.details, t]);
    setDetailInput("");
  };
  const removeDetail = (i: number) => setField("details", draft.details.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!draft.name.trim()) return setError("El nombre es obligatorio.");
    if (!draft.slug.trim()) return setError("El slug es obligatorio.");
    if (!draft.categorySlug) return setError("Elegí una categoría.");
    if (draft.price <= 0) return setError("El precio debe ser mayor a 0.");
    if (!isEdit && all.some((p) => p.slug === draft.slug)) return setError("Ya existe un producto con ese slug.");

    setSaving(true);
    try {
      if (isEdit && initial) {
        await update(initial.slug, draft);
      } else {
        await create(draft);
      }
      router.push("/admin/productos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-5xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
        <div>
          <span className="eyebrow">{isEdit ? "Editar producto" : "Nuevo producto"}</span>
          <h1 className="display text-4xl md:text-5xl mt-2">
            {isEdit ? draft.name || "Sin nombre" : "Crear producto"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="px-4 py-2.5 rounded-full text-sm text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)] text-white shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)] disabled:opacity-60"
          >
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-5 py-3 rounded-2xl bg-[var(--color-pink)]/10 border border-[var(--color-pink)]/40 text-sm text-[var(--color-pink-soft)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card title="Información básica">
            <Field label="Nombre">
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                className="input"
                placeholder="Ej. Castillo Mágico"
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => setField("slug", slugify(e.target.value))}
                disabled={isEdit}
                className="input font-mono"
                placeholder="castillo-magico"
              />
            </Field>
            <Field label="Descripción">
              <textarea
                value={draft.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
                className="input"
                placeholder="Descripción visible en la página del producto..."
              />
            </Field>
          </Card>

          <Card title="Imágenes">
            <p className="text-xs text-[var(--color-ivory-mute)]">
              Pegá URLs de imágenes. La primera es la portada en el catálogo.
              Sin imágenes se usa el emoji como fallback.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                placeholder="https://..."
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2.5 rounded-full text-sm bg-[var(--color-blue)]/15 text-[var(--color-blue-soft)] border border-[var(--color-blue)]/40 hover:bg-[var(--color-blue)]/20 transition-colors"
              >
                + Agregar
              </button>
            </div>
            {draft.images.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {draft.images.map((src, i) => (
                  <li key={i} className="relative group glass rounded-xl overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button type="button" onClick={() => moveImage(i, -1)} className="px-2 py-1 rounded text-xs bg-white/20 hover:bg-white/30">←</button>
                      <button type="button" onClick={() => moveImage(i, 1)} className="px-2 py-1 rounded text-xs bg-white/20 hover:bg-white/30">→</button>
                      <button type="button" onClick={() => removeImage(i)} className="px-2 py-1 rounded text-xs bg-[var(--color-pink)]/40 hover:bg-[var(--color-pink)]/60">✕</button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-[0.55rem] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--color-blue)]/80 text-white">
                        Portada
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Detalles (lista de bullets)">
            <div className="flex gap-2">
              <input
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDetail())}
                placeholder="Ej. Edad +6"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2.5 rounded-full text-sm bg-[var(--color-blue)]/15 text-[var(--color-blue-soft)] border border-[var(--color-blue)]/40 hover:bg-[var(--color-blue)]/20 transition-colors"
              >
                + Agregar
              </button>
            </div>
            {draft.details.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-3">
                {draft.details.map((d, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
                  >
                    <span className="text-[var(--color-blue)]">✦</span> {d}
                    <button
                      type="button"
                      onClick={() => removeDetail(i)}
                      className="ml-1 text-[var(--color-ivory-mute)] hover:text-[var(--color-pink)]"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-5">
          <Card title="Estado">
            <FieldRow label="Activo (visible)">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setField("active", e.target.checked)}
                className="accent-[var(--color-blue)] w-5 h-5"
              />
            </FieldRow>
            <FieldRow label="En oferta">
              <input
                type="checkbox"
                checked={draft.onSale}
                onChange={(e) => setField("onSale", e.target.checked)}
                className="accent-[var(--color-gold)] w-5 h-5"
              />
            </FieldRow>
          </Card>

          <Card title="Categoría">
            <Field label="Sección">
              <select
                value={draft.categorySlug}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="input"
              >
                <option value="">— elegir —</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.icon}  {c.name}</option>
                ))}
              </select>
            </Field>
          </Card>

          <Card title="Precio">
            <Field label="Precio (ARS)">
              <input
                type="number"
                min={0}
                value={draft.price || ""}
                onChange={(e) => setField("price", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Precio anterior (opcional)">
              <input
                type="number"
                min={0}
                value={draft.oldPrice ?? ""}
                onChange={(e) => setField("oldPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="input"
                placeholder="Para mostrar tachado en oferta"
              />
            </Field>
          </Card>

          <Card title="Etiquetas">
            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((b) => {
                const on = draft.badges?.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
                      on
                        ? "bg-[var(--color-blue)]/30 text-white border border-[var(--color-blue)]/60"
                        : "glass text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)]"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Visual">
            <Field label="Emoji / glyph">
              <input
                type="text"
                value={draft.icon}
                onChange={(e) => setField("icon", e.target.value)}
                maxLength={4}
                className="input text-2xl text-center"
              />
            </Field>
            <Field label="Color acento (hex)">
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={draft.accent}
                  onChange={(e) => setField("accent", e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={draft.accent}
                  onChange={(e) => setField("accent", e.target.value)}
                  className="input flex-1 font-mono"
                />
              </div>
            </Field>
            <Field label={`Rating: ${draft.rating}★`}>
              <input
                type="range"
                min={0}
                max={5}
                value={draft.rating}
                onChange={(e) => setField("rating", Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
            </Field>
          </Card>
        </div>
      </div>

      {/* style helpers */}
      <style jsx>{`
        .input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          color: var(--color-ivory);
          font-size: 0.875rem;
          outline: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .input::placeholder { color: var(--color-ivory-mute); }
        .input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--color-blue);
        }
        .input:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-[var(--radius-lg)] p-5 flex flex-col gap-3">
      <h3 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-xs text-[var(--color-ivory-dim)]">{label}</span>
      {children}
    </label>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between text-sm py-1">
      <span className="text-[var(--color-ivory-dim)]">{label}</span>
      {children}
    </label>
  );
}
