"use client";

/**
 * useAuth — login admin contra credenciales server-side.
 * Hoy: POST /api/admin/login con ADMIN_USER/ADMIN_PASS del .env.
 * Mañana: Firebase Auth.
 */

import { useCallback } from "react";
import { useStore } from "./StoreProvider";

export function useAuth() {
  const { session, setSession, openLogin, closeLogin, loginOpen } = useStore();

  const isAdmin = session !== null;

  const login = useCallback(
    async (user: string, pass: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ user, pass }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Error desconocido" }));
          return { ok: false, error: body.error ?? "Credenciales inválidas." };
        }
        await setSession({ user: user.trim(), loggedAt: Date.now() });
        return { ok: true };
      } catch {
        return { ok: false, error: "Error de red." };
      }
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    await setSession(null);
  }, [setSession]);

  return { session, isAdmin, login, logout, open: openLogin, close: closeLogin, isOpen: loginOpen };
}
