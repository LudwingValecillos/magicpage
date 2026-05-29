"use client";

/**
 * StoreProvider — contexto único con productos + carrito + sesión admin.
 * Hidrata desde el adapter al montar.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adapter } from "./adapter";
import type { AdminSession, CartItem, Product } from "./types";

interface StoreState {
  ready: boolean;
  products: Product[];
  cart: CartItem[];
  session: AdminSession | null;

  cartOpen: boolean;
  searchOpen: boolean;
  loginOpen: boolean;

  setProducts: (next: Product[]) => Promise<void>;
  setCart: (next: CartItem[]) => Promise<void>;
  setSession: (s: AdminSession | null) => Promise<void>;

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
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [session, setSessionState] = useState<AdminSession | null>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, ct, s] = await Promise.all([
        adapter.listProducts(),
        adapter.loadCart(),
        adapter.loadSession(),
      ]);
      if (!alive) return;
      setProductsState(p);
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
      cart,
      session,
      cartOpen,
      searchOpen,
      loginOpen,
      setProducts,
      setCart,
      setSession,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
    }),
    [ready, products, cart, session, cartOpen, searchOpen, loginOpen, setProducts, setCart, setSession],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
