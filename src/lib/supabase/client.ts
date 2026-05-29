/**
 * Supabase browser client (anon key).
 * Solo lee productos (RLS bloquea escrituras desde el cliente).
 * Las escrituras pasan por /api/admin/products usando el server client.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
