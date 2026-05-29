/**
 * /api/admin/products — sync del catálogo completo.
 *
 * POST body: { products: Product[] }
 * - Upserts todos los productos del body
 * - Borra cualquier producto en DB cuyo slug no esté en el body
 *
 * Auth: cookie `admin_session` seteada por /api/admin/login (HttpOnly).
 * Si no hay cookie válida → 401.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/lib/store/types";

const CATEGORIAS = new Set(["ropa", "juguetes", "accesorios"]);
const MARCAS = new Set(["disney", "marvel", "otra"]);

function validate(p: unknown): p is Product {
  if (typeof p !== "object" || p === null) return false;
  const x = p as Record<string, unknown>;
  if (typeof x.slug !== "string" || !x.slug.trim()) return false;
  if (typeof x.nombre !== "string" || !x.nombre.trim()) return false;
  if (typeof x.precio !== "number" || x.precio < 0) return false;
  if (typeof x.categoria !== "string" || !CATEGORIAS.has(x.categoria)) return false;
  if (typeof x.marca !== "string" || !MARCAS.has(x.marca)) return false;
  if (!Array.isArray(x.imagenes)) return false;
  if (!Array.isArray(x.talles) || !x.talles.every((t) => typeof t === "string")) return false;
  if (typeof x.oferta !== "boolean") return false;
  if (typeof x.activo !== "boolean") return false;
  if (x.oferta && (typeof x.precioAnterior !== "number" || x.precioAnterior <= 0)) {
    return false;
  }
  return true;
}

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get("admin_session")?.value;
  if (!token) return false;
  return token === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { products?: unknown } | null;
  const products = body?.products;
  if (!Array.isArray(products) || !products.every(validate)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const rows = products.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    precio: p.precio,
    categoria: p.categoria,
    marca: p.marca,
    imagenes: p.imagenes,
    talles: p.talles ?? [],
    descripcion: p.descripcion ?? null,
    oferta: p.oferta,
    precio_anterior: p.precioAnterior ?? null,
    activo: p.activo,
  }));

  const { error: upsertErr } = await supabaseAdmin
    .from("productos")
    .upsert(rows, { onConflict: "slug" });
  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  const keepSlugs = rows.map((r) => r.slug);
  const { data: existing, error: listErr } = await supabaseAdmin
    .from("productos")
    .select("slug");
  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }
  const toDelete = (existing ?? [])
    .map((r) => r.slug)
    .filter((s) => !keepSlugs.includes(s));

  if (toDelete.length > 0) {
    const { error: delErr } = await supabaseAdmin
      .from("productos")
      .delete()
      .in("slug", toDelete);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
