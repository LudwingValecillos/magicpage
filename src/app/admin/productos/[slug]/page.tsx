"use client";

import Link from "next/link";
import { use } from "react";
import { useProducts } from "@/lib/store/useProducts";
import { useStore } from "@/lib/store/StoreProvider";
import { ProductForm } from "@/components/admin/ProductForm";

type Params = Promise<{ slug: string }>;

export default function EditProductPage({ params }: { params: Params }) {
  const { slug } = use(params);
  const { ready } = useStore();
  const { findBySlug } = useProducts();

  if (!ready) {
    return (
      <div className="text-[var(--color-ink-mute)] text-sm uppercase tracking-widest">
        Cargando...
      </div>
    );
  }

  const product = findBySlug(slug);
  if (!product) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl">🔎</span>
        <h1 className="display text-3xl mt-4 text-[var(--color-ink)]">Producto no encontrado</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          No existe ningún producto con slug &ldquo;{slug}&rdquo;.
        </p>
        <Link
          href="/admin/productos"
          className="inline-block mt-6 px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)] hover:bg-[var(--color-sky-soft)]/30 transition-colors"
        >
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return <ProductForm initial={product} />;
}
