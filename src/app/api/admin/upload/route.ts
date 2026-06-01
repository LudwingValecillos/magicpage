/**
 * /api/admin/upload — sube una imagen al bucket `productos` de Supabase Storage.
 *
 * POST multipart/form-data con campo `file` (y opcional `slug` para organizar).
 * Devuelve { url, storagePath } — la `url` pública se guarda en imagenes[].url
 * del producto (columna jsonb `imagenes` en la tabla `productos`).
 *
 * Auth: cookie `admin_session` (igual que /api/admin/products).
 * Sube con service_role (bypassa RLS), por eso no requiere policy de INSERT.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "productos";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get("admin_session")?.value;
  if (!token) return false;
  return token === process.env.ADMIN_SESSION_TOKEN;
}

function slugifyPart(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Se esperaba multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá JPG, PNG, WEBP, GIF o AVIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen supera los 5 MB." }, { status: 400 });
  }

  const slug = slugifyPart(String(form.get("slug") ?? "")) || "sin-slug";
  const ext = EXT[file.type] ?? "bin";
  const rand = Math.random().toString(36).slice(2, 8);
  const storagePath = `${slug}/${Date.now()}-${rand}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);

  return NextResponse.json({ url: data.publicUrl, storagePath });
}
