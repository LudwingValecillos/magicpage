/**
 * GET /api/settings — configuración pública de la tienda.
 * La web la consume al cargar (provider) para obtener el número de WhatsApp
 * editable desde el admin. Lectura pública (no requiere auth).
 *
 * Fallback: si la DB falla o no hay valor, devuelve el número del env
 * (NEXT_PUBLIC_WHATSAPP_NUMBER) para que la tienda nunca quede sin número.
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

const ENV_FALLBACK = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export async function GET() {
  let whatsappNumber = ENV_FALLBACK;

  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "whatsapp_number")
      .maybeSingle();

    if (!error && data?.value) {
      whatsappNumber = data.value;
    }
  } catch {
    // ignora: usa el fallback del env
  }

  return NextResponse.json(
    { whatsappNumber },
    {
      // cache corto: cambios del admin se reflejan rápido sin martillar la DB
      headers: { "Cache-Control": "public, max-age=30, s-maxage=30" },
    },
  );
}
