/**
 * SupabaseAdapter — implementación del Adapter contra Postgres + Storage.
 *
 * - listProducts: SELECT directo via anon key (RLS permite read all).
 * - saveProducts: POST /api/admin/products (server usa service_role).
 * - Cart + Session: siguen en localStorage (heredados de LocalStorageAdapter).
 *
 * Para activarlo, editar src/lib/store/adapter.ts:
 *   export const adapter: Adapter = new SupabaseAdapter();
 */

import { supabase } from "@/lib/supabase/client";
import { LocalStorageAdapter } from "./localStorageAdapter";
import type { Product, ProductImage } from "./types";

interface ProductRow {
  slug: string;
  nombre: string;
  precio: number | string;
  categoria: Product["categoria"];
  marca: Product["marca"];
  imagenes: ProductImage[];
  talles: string[] | null;
  descripcion: string | null;
  oferta: boolean;
  precio_anterior: number | string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    nombre: r.nombre,
    precio: Number(r.precio),
    categoria: r.categoria,
    marca: r.marca,
    imagenes: r.imagenes,
    talles: r.talles ?? [],
    descripcion: r.descripcion ?? undefined,
    oferta: r.oferta,
    precioAnterior: r.precio_anterior == null ? undefined : Number(r.precio_anterior),
    activo: r.activo,
    createdAt: new Date(r.created_at).getTime(),
    updatedAt: new Date(r.updated_at).getTime(),
  };
}

export class SupabaseAdapter extends LocalStorageAdapter {
  async listProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] listProducts:", error.message);
      return [];
    }
    return (data ?? []).map(rowToProduct);
  }

  async saveProducts(products: Product[]): Promise<void> {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ products }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Save falló (${res.status})`);
    }
  }
}
