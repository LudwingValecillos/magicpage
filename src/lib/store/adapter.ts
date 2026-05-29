/**
 * Persistencia abstracta — interfaz + selección del adapter activo.
 *
 * Implementaciones:
 *   - LocalStorageAdapter (src/lib/store/localStorageAdapter.ts)
 *   - SupabaseAdapter     (src/lib/store/supabaseAdapter.ts) ← activo
 *
 * Para hacer rollback a localStorage puro: cambiar la línea final.
 */

import type { AdminSession, CartItem, Product } from "./types";
import { SupabaseAdapter } from "./supabaseAdapter";
import { clearLocalStore } from "./localStorageAdapter";

export interface Adapter {
  listProducts(): Promise<Product[]>;
  saveProducts(products: Product[]): Promise<void>;
  loadCart(): Promise<CartItem[]>;
  saveCart(items: CartItem[]): Promise<void>;
  loadSession(): Promise<AdminSession | null>;
  saveSession(s: AdminSession | null): Promise<void>;
}

/** Adapter activo: Supabase (productos en DB, carrito/sesión en localStorage). */
export const adapter: Adapter = new SupabaseAdapter();

/** Reset total — usado por botón "Limpiar catálogo" en admin. */
export async function resetStore(): Promise<void> {
  clearLocalStore();
}
