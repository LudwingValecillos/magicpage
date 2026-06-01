"use client";

/**
 * <ProductForm> — alta/edición de Producto con schema nuevo:
 *   nombre, precio, categoria, marca, imagenes[], descripcion?, oferta, precioAnterior?, activo.
 * Imágenes: lista de URLs (luego serán subidas a Firebase Storage).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/store/useProducts";
import type { CategoriaSlug, MarcaSlug, Product } from "@/lib/store/types";

interface ProductFormProps {
  initial?: Product;
}

function emptyDraft(): Product {
  return {
    slug: "",
    nombre: "",
    precio: 0,
    categoria: "ropa",
    marca: "otra",
    imagenes: [],
    talles: [],
    descripcion: "",
    oferta: false,
    precioAnterior: undefined,
    activo: true,
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
  const { categorias, marcas, create, update, all } = useProducts();
  const isEdit = Boolean(initial);

  const [draft, setDraft] = useState<Product>(initial ?? emptyDraft());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imgInput, setImgInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: { url: string; storagePath: string }[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("slug", draft.slug || draft.nombre || "producto");
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error ?? `Subida falló (${res.status})`);
        uploaded.push({ url: body.url, storagePath: body.storagePath });
      }
      setField("imagenes", [...draft.imagenes, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isEdit) return;
    setDraft((d) => ({ ...d, slug: slugify(d.nombre) }));
  }, [draft.nombre, isEdit]);

  const setField = <K extends keyof Product>(k: K, v: Product[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const addImage = () => {
    const url = imgInput.trim();
    if (!url) return;
    setField("imagenes", [...draft.imagenes, { url, storagePath: "" }]);
    setImgInput("");
  };
  const removeImage = (i: number) =>
    setField(
      "imagenes",
      draft.imagenes.filter((_, idx) => idx !== i),
    );
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.imagenes.length) return;
    const next = [...draft.imagenes];
    [next[i], next[j]] = [next[j], next[i]];
    setField("imagenes", next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!draft.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!draft.slug.trim()) return setError("El slug es obligatorio.");
    if (draft.precio <= 0) return setError("El precio debe ser mayor a 0.");
    if (draft.oferta && (!draft.precioAnterior || draft.precioAnterior <= draft.precio)) {
      return setError("El precio anterior debe ser mayor al precio en oferta.");
    }
    if (!isEdit && all.some((p) => p.slug === draft.slug)) {
      return setError("Ya existe un producto con ese slug.");
    }

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
          <h1 className="display text-3xl md:text-4xl mt-2 text-[var(--color-ink)]">
            {isEdit ? draft.nombre || "Sin nombre" : "Crear producto"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="px-4 py-2.5 rounded-full text-sm text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--color-sky)] text-white shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-5 py-3 rounded-2xl bg-[var(--color-pink-tint)] border border-[var(--color-pink-soft)] text-sm text-[var(--color-pink-deep)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* main */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card title="Información básica">
            <Field label="Nombre">
              <input
                type="text"
                value={draft.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                className="adm-input"
                placeholder="Ej. Remera Spider-Man Talle 6"
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => setField("slug", slugify(e.target.value))}
                disabled={isEdit}
                className="adm-input font-mono"
                placeholder="remera-spiderman-talle-6"
              />
            </Field>
            <Field label="Descripción">
              <textarea
                value={draft.descripcion ?? ""}
                onChange={(e) => setField("descripcion", e.target.value)}
                rows={4}
                className="adm-input"
                placeholder="Detalle visible en la página del producto..."
              />
            </Field>
          </Card>

          <Card title="Imágenes">
            <p className="text-xs text-[var(--color-ink-mute)]">
              Subí imágenes desde tu dispositivo (se guardan en el servidor) o pegá una
              URL. La primera es la portada en el catálogo. Sin imágenes se muestra el
              emoji de la categoría.
            </p>

            <label
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--color-rule-strong)] px-4 py-6 text-center cursor-pointer transition-colors hover:border-[var(--color-sky)] hover:bg-[var(--color-sky-tint)] ${
                uploading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(e) => {
                  uploadFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <span className="text-2xl">{uploading ? "⏳" : "📷"}</span>
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                {uploading ? "Subiendo..." : "Subir imagen"}
              </span>
              <span className="text-[0.7rem] text-[var(--color-ink-mute)]">
                JPG, PNG, WEBP — máx. 5 MB
              </span>
            </label>

            <div className="flex items-center gap-2 text-[0.7rem] text-[var(--color-ink-mute)] uppercase tracking-widest">
              <span className="flex-1 h-px bg-[var(--color-rule)]" />o pegá una URL
              <span className="flex-1 h-px bg-[var(--color-rule)]" />
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
                placeholder="https://..."
                className="adm-input flex-1"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)] hover:bg-[var(--color-sky-soft)]/30 transition-colors"
              >
                + Agregar
              </button>
            </div>
            {draft.imagenes.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {draft.imagenes.map((img, i) => (
                  <li
                    key={i}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-[var(--color-rule)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[var(--color-ink)]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        className="px-2 py-1 rounded text-xs bg-white/90 text-[var(--color-ink)] hover:bg-white"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        className="px-2 py-1 rounded text-xs bg-white/90 text-[var(--color-ink)] hover:bg-white"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="px-2 py-1 rounded text-xs bg-[var(--color-pink)] text-white hover:bg-[var(--color-pink-deep)]"
                      >
                        ✕
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--color-sky)] text-white font-semibold">
                        Portada
                      </span>
                    )}
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
                checked={draft.activo}
                onChange={(e) => setField("activo", e.target.checked)}
                className="accent-[var(--color-sky)] w-5 h-5"
              />
            </FieldRow>
            <FieldRow label="En oferta">
              <input
                type="checkbox"
                checked={draft.oferta}
                onChange={(e) => setField("oferta", e.target.checked)}
                className="accent-[var(--color-coral)] w-5 h-5"
              />
            </FieldRow>
          </Card>

          <Card title="Clasificación">
            <Field label="Categoría">
              <select
                value={draft.categoria}
                onChange={(e) => setField("categoria", e.target.value as CategoriaSlug)}
                className="adm-input"
              >
                {categorias.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.emoji}  {c.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marca">
              <select
                value={draft.marca}
                onChange={(e) => setField("marca", e.target.value as MarcaSlug)}
                className="adm-input"
              >
                {marcas.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </Card>

          <Card title="Precio">
            <Field label="Precio (ARS)">
              <input
                type="number"
                min={0}
                value={draft.precio || ""}
                onChange={(e) => setField("precio", Number(e.target.value))}
                className="adm-input"
              />
            </Field>
            <Field label="Precio anterior (si está en oferta)">
              <input
                type="number"
                min={0}
                value={draft.precioAnterior ?? ""}
                onChange={(e) =>
                  setField(
                    "precioAnterior",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="adm-input"
                placeholder="Se muestra tachado"
              />
            </Field>
          </Card>

          <Card title="Talles">
            <Field label="Separados por guión o coma (ej. 2-4-6-8 o S,M,L)">
              <input
                type="text"
                value={draft.talles.join("-")}
                onChange={(e) =>
                  setField(
                    "talles",
                    e.target.value
                      .split(/[-,\s]+/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                className="adm-input font-mono"
                placeholder="2-4-6-8"
              />
            </Field>
            {draft.talles.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {draft.talles.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <style jsx>{`
        :global(.adm-input) {
          width: 100%;
          background: white;
          border: 1px solid var(--color-rule);
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          color: var(--color-ink);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        :global(.adm-input::placeholder) {
          color: var(--color-ink-mute);
        }
        :global(.adm-input:focus) {
          border-color: var(--color-sky);
          box-shadow: 0 0 0 3px var(--color-sky-tint);
        }
        :global(.adm-input:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
          background: var(--color-bg-tint);
        }
      `}</style>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <h3 className="text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-xs text-[var(--color-ink-soft)] font-semibold">{label}</span>
      {children}
    </label>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between text-sm py-1">
      <span className="text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
