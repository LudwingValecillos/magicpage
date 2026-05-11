"use client";

/**
 * StoreProvider — single React context that exposes the entire client store.
 *
 * Wraps the app at <html><body><StoreProvider>...</StoreProvider></body></html>
 * (mounted in src/app/layout.tsx).
 *
 * Hydration: on mount, loads from the adapter (localStorage). All children
 * read via the useStore() hook below or the convenience hooks in this folder.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adapter } from "./adapter";
import type { AdminSession, CartItem, Category, Product } from "./types";

interface StoreState {
  ready: boolean;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  session: AdminSession | null;

  // overlay UI state
  cartOpen: boolean;
  searchOpen: boolean;
  loginOpen: boolean;

  // mutators
  setProducts: (next: Product[]) => Promise<void>;
  setCategories: (next: Category[]) => Promise<void>;
  setCart: (next: CartItem[]) => Promise<void>;
  setSession: (s: AdminSession | null) => Promise<void>;

  // overlay toggles
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openLogin: () => void;
  closeLogin: () => void;
}

const Ctx = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [session, setSessionState] = useState<AdminSession | null>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // initial hydration
  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, c, ct, s] = await Promise.all([
        adapter.listProducts(),
        adapter.listCategories(),
        adapter.loadCart(),
        adapter.loadSession(),
      ]);
      if (!alive) return;
      setProductsState(p);
      setCategoriesState(c);
      setCartState(ct);
      setSessionState(s);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setProducts = useCallback(async (next: Product[]) => {
    setProductsState(next);
    await adapter.saveProducts(next);
  }, []);
  const setCategories = useCallback(async (next: Category[]) => {
    setCategoriesState(next);
    await adapter.saveCategories(next);
  }, []);
  const setCart = useCallback(async (next: CartItem[]) => {
    setCartState(next);
    await adapter.saveCart(next);
  }, []);
  const setSession = useCallback(async (s: AdminSession | null) => {
    setSessionState(s);
    await adapter.saveSession(s);
  }, []);

  const value = useMemo<StoreState>(
    () => ({
      ready,
      products,
      categories,
      cart,
      session,
      cartOpen,
      searchOpen,
      loginOpen,
      setProducts,
      setCategories,
      setCart,
      setSession,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
    }),
    [ready, products, categories, cart, session, cartOpen, searchOpen, loginOpen, setProducts, setCategories, setCart, setSession],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
