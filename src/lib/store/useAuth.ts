"use client";

/**
 * useAuth — admin login/logout. Demo credentials: admin / admin.
 *
 * NOTE: This is a CLIENT-SIDE ONLY demo. Real production needs:
 *   - Supabase Auth (or any backend auth)
 *   - JWT validation
 *   - Server-side route protection
 * See SUPABASE.md for the migration plan.
 */

import { useCallback } from "react";
import { useStore } from "./StoreProvider";

const DEMO_USER = "admin";
const DEMO_PASS = "admin";

export function useAuth() {
  const { session, setSession, openLogin, closeLogin, loginOpen } = useStore();

  const isAdmin = session !== null;

  const login = useCallback(
    async (user: string, pass: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (user.trim() !== DEMO_USER || pass !== DEMO_PASS) {
        return { ok: false, error: "Credenciales inválidas. Probá admin / admin." };
      }
      await setSession({ user: DEMO_USER, loggedAt: Date.now() });
      return { ok: true };
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    await setSession(null);
  }, [setSession]);

  return { session, isAdmin, login, logout, open: openLogin, close: closeLogin, isOpen: loginOpen };
}
