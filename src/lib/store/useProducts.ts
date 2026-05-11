"use client";

/**
 * useProducts — read + mutate the product catalog.
 *
 * Auto-respects the `active` flag in public lists (use listAll() to bypass).
 */

import { useCallback, useMemo } from "react";
import { useStore } from "./StoreProvider";
import type { Product } from "./types";

export function useProducts() {
  const { products, setProducts, categories } = useStore();

  const visible = useMemo(() => products.filter((p) => p.active), [products]);

  const findBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const create = useCallback(
    async (p: Product) => {
      if (products.some((x) => x.slug === p.slug)) {
        throw new Error(`Producto con slug "${p.slug}" ya existe`);
      }
      await setProducts([p, ...products]);
    },
    [products, setProducts],
  );

  const update = useCallback(
    async (slug: string, patch: Partial<Product>) => {
      const next = products.map((p) => (p.slug === slug ? { ...p, ...patch } : p));
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

  const toggleActive = useCallback(
    async (slug: string) => {
      const p = products.find((x) => x.slug === slug);
      if (!p) return;
      await update(slug, { active: !p.active });
    },
    [products, update],
  );

  const toggleSale = useCallback(
    async (slug: string) => {
      const p = products.find((x) => x.slug === slug);
      if (!p) return;
      await update(slug, { onSale: !p.onSale });
    },
    [products, update],
  );

  return {
    all: products,
    visible,
    categories,
    findBySlug,
    create,
    update,
    remove,
    toggleActive,
    toggleSale,
  };
}
