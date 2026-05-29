"use client";

/**
 * useProducts — leer + mutar catálogo.
 * Las categorías son fijas (3) y vienen de site.ts, no del adapter.
 */

import { useCallback, useMemo } from "react";
import { useStore } from "./StoreProvider";
import { site } from "@/content/site";
import type { Product, CategoriaSlug, MarcaSlug } from "./types";

export function useProducts() {
  const { products, setProducts } = useStore();

  const visibles = useMemo(() => products.filter((p) => p.activo), [products]);

  const findBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const byCategoria = useCallback(
    (c: CategoriaSlug) => visibles.filter((p) => p.categoria === c),
    [visibles],
  );

  const byMarca = useCallback(
    (m: MarcaSlug) => visibles.filter((p) => p.marca === m),
    [visibles],
  );

  const ofertas = useMemo(() => visibles.filter((p) => p.oferta), [visibles]);

  const create = useCallback(
    async (p: Product) => {
      if (products.some((x) => x.slug === p.slug)) {
        throw new Error(`Ya existe un producto con slug "${p.slug}"`);
      }
      const now = Date.now();
      await setProducts([{ ...p, createdAt: now, updatedAt: now }, ...products]);
    },
    [products, setProducts],
  );

  const update = useCallback(
    async (slug: string, patch: Partial<Product>) => {
      const next = products.map((p) =>
        p.slug === slug ? { ...p, ...patch, updatedAt: Date.now() } : p,
      );
      await setProducts(next);
    },
    [products, setProducts],
  );

  const remove = useCallback(
    async (slug: string) => {
      await setProducts(products.filter((p) => p.slug !== slug));
    },
    [products, setProducts],
  );

  const toggleActivo = useCallback(
    async (slug: string) => {
      const p = products.find((x) => x.slug === slug);
      if (!p) return;
      await update(slug, { activo: !p.activo });
    },
    [products, update],
  );

  const toggleOferta = useCallback(
    async (slug: string) => {
      const p = products.find((x) => x.slug === slug);
      if (!p) return;
      await update(slug, { oferta: !p.oferta });
    },
    [products, update],
  );

  return {
    all: products,
    visibles,
    categorias: site.categorias,
    marcas: site.marcas,
    findBySlug,
    byCategoria,
    byMarca,
    ofertas,
    create,
    update,
    remove,
    toggleActivo,
    toggleOferta,
  };
}
