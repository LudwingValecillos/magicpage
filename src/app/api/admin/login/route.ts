/**
 * POST /api/admin/login — valida credenciales contra .env.
 * Si OK, setea cookie `admin_session` (HttpOnly) para autorizar /api/admin/*.
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, pass } = (await req.json().catch(() => ({}))) as {
    user?: string;
    pass?: string;
  };

  const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS ?? "admin";
  const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN;

  if (typeof user !== "string" || typeof pass !== "string") {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  if (user.trim() !== ADMIN_USER || pass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  if (!SESSION_TOKEN) {
    return NextResponse.json(
      { error: "Server mal configurado: falta ADMIN_SESSION_TOKEN." },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  return res;
}
