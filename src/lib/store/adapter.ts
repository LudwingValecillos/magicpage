/**
 * Persistence adapter — abstracts where state lives so we can swap
 * localStorage for Supabase without touching components.
 *
 * Current impl: LocalStorageAdapter. Seeds from src/content/site.ts on
 * first run, then writes back any user mutation.
 *
 * To migrate to Supabase: implement SupabaseAdapter (see src/lib/supabase/)
 * and change the export at the bottom of this file. That is the ONLY
 * change required for the rest of the app.
 */

import { site } from "@/content/site";
import type { Product, Category, CartItem, AdminSession } from "./types";

export interface Adapter {
  // products
  listProducts(): Promise<Product[]>;
  saveProducts(products: Product[]): Promise<void>;
  // categories
  listCategories(): Promise<Category[]>;
  saveCategories(cats: Category[]): Promise<void>;
  // cart
  loadCart(): Promise<CartItem[]>;
  saveCart(items: CartItem[]): Promise<void>;
  // auth
  loadSession(): Promise<AdminSession | null>;
  saveSession(s: AdminSession | null): Promise<void>;
}

const KEYS = {
  products: "magic.products.v1",
  categories: "magic.categories.v1",
  cart: "magic.cart.v1",
  session: "magic.session.v1",
} as const;

/**
 * Hydrates a seed Product (from site.ts) with the writable fields the
 * admin panel manages. Defaults: active=true, onSale = oldPrice present,
 * images = [] (UI falls back to emoji glyph).
 */
function hydrateSeedProduct(p: (typeof site.products)[number]): Product {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    badges: p.badges ? [...p.badges] : undefined,
    icon: p.icon,
    accent: p.accent,
    description: p.description,
    details: [...p.details],
    images: [],
    active: true,
    onSale: typeof p.oldPrice === "number",
  };
}

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
      /* quota exceeded — ignore */
    }
  }

  async listProducts(): Promise<Product[]> {
    const stored = this.read<Product[] | null>(KEYS.products, null);
    if (stored && Array.isArray(stored) && stored.length) return stored;
    const seeded = site.products.map(hydrateSeedProduct);
    this.write(KEYS.products, seeded);
    return seeded;
  }
  async saveProducts(products: Product[]): Promise<void> {
    this.write(KEYS.products, products);
  }

  async listCategories(): Promise<Category[]> {
    const stored = this.read<Category[] | null>(KEYS.categories, null);
    if (stored && Array.isArray(stored) && stored.length) return stored;
    const seeded = site.categories.map((c) => ({ ...c }));
    this.write(KEYS.categories, seeded);
    return seeded;
  }
  async saveCategories(cats: Category[]): Promise<void> {
    this.write(KEYS.categories, cats);
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

/**
 * The single adapter instance the app uses. Swap this line to migrate
 * to Supabase (see src/lib/supabase/SupabaseAdapter.ts when you write it).
 */
export const adapter: Adapter = new LocalStorageAdapter();

/** Reset all stored data and re-seed from site.ts. Used by admin "Reset" action. */
export async function resetStore(): Promise<void> {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  // trigger re-seed
  await adapter.listProducts();
  await adapter.listCategories();
}
