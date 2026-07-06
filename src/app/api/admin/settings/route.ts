/**
 * /api/admin/settings — lectura y guardado de configuración (admin).
 *
 * GET  → devuelve el número actual (para prellenar el form del admin).
 * POST → { whatsappNumber: string } guarda el número normalizado.
 *
 * Auth: cookie `admin_session` (igual que /api/admin/products). Sin cookie → 401.
 * Escritura vía service_role (bypassa RLS).
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeArgentinePhone } from "@/lib/phone";

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get("admin_session")?.value;
  if (!token) return false;
  return token === process.env.ADMIN_SESSION_TOKEN;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("value")
    .eq("key", "whatsapp_number")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    whatsappNumber: data?.value ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { whatsappNumber?: string };

  if (typeof body.whatsappNumber !== "string") {
    return NextResponse.json({ error: "Falta el número." }, { status: 400 });
  }

  // Validar/normalizar al formato wa.me (Argentina-aware)
  const normalized = normalizeArgentinePhone(body.whatsappNumber);
  if (!normalized.valid) {
    return NextResponse.json(
      { error: normalized.error ?? "Número inválido." },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("settings")
    .upsert(
      { key: "whatsapp_number", value: normalized.value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    whatsappNumber: normalized.value,
    pretty: normalized.pretty,
  });
}
