/**
 * Persistencia abstracta — el resto de la app NO sabe si los datos
 * viven en localStorage o en Firestore.
 *
 * Hoy: LocalStorageAdapter (empty seed).
 * Mañana: FirebaseAdapter (src/lib/firebase/adapter.ts).
 *
 * Para migrar: cambiar SOLO la línea final del archivo.
 */

import type { AdminSession, CartItem, Product } from "./types";

export interface Adapter {
  listProducts(): Promise<Product[]>;
  saveProducts(products: Product[]): Promise<void>;
  loadCart(): Promise<CartItem[]>;
  saveCart(items: CartItem[]): Promise<void>;
  loadSession(): Promise<AdminSession | null>;
  saveSession(s: AdminSession | null): Promise<void>;
}

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

/** Adapter activo. Swap esta línea para migrar a Firebase. */
export const adapter: Adapter = new LocalStorageAdapter();

/** Reset total — usado por botón "Limpiar catálogo" en admin. */
export async function resetStore(): Promise<void> {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
