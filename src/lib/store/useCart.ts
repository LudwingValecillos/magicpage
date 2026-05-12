"use client";

/**
 * useCart — add/remove/qty + totales.
 * Cart guarda solo (slug, qty); se joinea con products para calcular precios.
 */

import { useCallback, useMemo } from "react";
import { useStore } from "./StoreProvider";

export function useCart() {
  const { cart, setCart, products, openCart, closeCart, cartOpen } = useStore();

  const items = useMemo(
    () =>
      cart
        .map((ci) => {
          const p = products.find((x) => x.slug === ci.slug);
          if (!p) return null;
          return { product: p, qty: ci.qty };
        })
        .filter((x): x is { product: NonNullable<typeof x>["product"]; qty: number } => x !== null),
    [cart, products],
  );

  const count = useMemo(() => cart.reduce((a, ci) => a + ci.qty, 0), [cart]);
  const subtotal = useMemo(
    () => items.reduce((a, it) => a + it.product.precio * it.qty, 0),
    [items],
  );

  const add = useCallback(
    async (slug: string, qty = 1) => {
      const existing = cart.find((ci) => ci.slug === slug);
      const next = existing
        ? cart.map((ci) => (ci.slug === slug ? { ...ci, qty: ci.qty + qty } : ci))
        : [...cart, { slug, qty }];
      await setCart(next);
    },
    [cart, setCart],
  );

  const setQty = useCallback(
    async (slug: string, qty: number) => {
      if (qty <= 0) {
        await setCart(cart.filter((ci) => ci.slug !== slug));
        return;
      }
      await setCart(cart.map((ci) => (ci.slug === slug ? { ...ci, qty } : ci)));
    },
    [cart, setCart],
  );

  const remove = useCallback(
    async (slug: string) => {
      await setCart(cart.filter((ci) => ci.slug !== slug));
    },
    [cart, setCart],
  );

  const clear = useCallback(async () => setCart([]), [setCart]);

  return {
    items,
    count,
    subtotal,
    add,
    setQty,
    remove,
    clear,
    open: openCart,
    close: closeCart,
    isOpen: cartOpen,
  };
}
