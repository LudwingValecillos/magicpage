/**
 * POST /api/admin/login — valida credenciales contra .env.
 * Devuelve 200 si OK, 401 si no.
 *
 * No setea cookies por ahora — la sesión es client-side en localStorage.
 * Cuando migremos a Firebase Auth, este endpoint desaparece.
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, pass } = (await req.json().catch(() => ({}))) as {
    user?: string;
    pass?: string;
  };

  const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS ?? "admin";

  if (typeof user !== "string" || typeof pass !== "string") {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  if (user.trim() !== ADMIN_USER || pass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
