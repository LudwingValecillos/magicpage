/**
 * LocalStorageAdapter — persistencia local en window.localStorage.
 * Usado standalone para dev, o como base de SupabaseAdapter
 * (carrito/sesión siguen local incluso con Supabase activo).
 */

import type { Adapter } from "./adapter";
import type { AdminSession, CartItem, Product } from "./types";

const KEYS = {
  products: "magic.productos.v2",
  cart: "magic.cart.v2",
  session: "magic.session.v2",
} as const;

export class LocalStorageAdapter implements Adapter {
  private read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private write<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota — ignore */
    }
  }

  async listProducts(): Promise<Product[]> {
    return this.read<Product[]>(KEYS.products, []);
  }
  async saveProducts(products: Product[]): Promise<void> {
    this.write(KEYS.products, products);
  }

  async loadCart(): Promise<CartItem[]> {
    return this.read<CartItem[]>(KEYS.cart, []);
  }
  async saveCart(items: CartItem[]): Promise<void> {
    this.write(KEYS.cart, items);
  }

  async loadSession(): Promise<AdminSession | null> {
    return this.read<AdminSession | null>(KEYS.session, null);
  }
  async saveSession(s: AdminSession | null): Promise<void> {
    if (s === null) {
      if (typeof window !== "undefined") window.localStorage.removeItem(KEYS.session);
      return;
    }
    this.write(KEYS.session, s);
  }
}

export function clearLocalStore(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
