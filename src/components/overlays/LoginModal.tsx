"use client";

/**
 * LoginModal — admin login form light.
 * POST /api/admin/login con ADMIN_USER / ADMIN_PASS desde env.
 * On success → /admin.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";

export function LoginModal() {
  const { login, isOpen, close } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setUser("");
    setPass("");
    setError(null);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(user, pass);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    close();
    router.push("/admin");
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm" />

      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="relative w-full max-w-md bg-white rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-rule)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
      >
        <div
          className="relative px-7 py-7 border-b border-[var(--color-rule)] overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-sky-tint), var(--color-pink-tint))" }}
        >
          <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[var(--color-sky)]/20 blur-2xl" />
          <span className="eyebrow">Acceso restringido</span>
          <h2 className="display text-2xl mt-2 text-[var(--color-ink)]">Panel de admin</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Iniciá sesión para gestionar el catálogo.
          </p>
        </div>

        <div className="px-7 py-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
              Usuario
            </span>
            <input
              autoFocus
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              className="px-4 py-2.5 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] outline-none focus:border-[var(--color-sky)] transition-colors"
              placeholder="admin"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
              Contraseña
            </span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="px-4 py-2.5 rounded-full bg-white border border-[var(--color-rule)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] outline-none focus:border-[var(--color-sky)] transition-colors"
              placeholder="••••••"
            />
          </label>

          {error && (
            <div className="text-xs text-[var(--color-pink-deep)] bg-[var(--color-pink-tint)] border border-[var(--color-pink-soft)] rounded-2xl px-4 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-7 pb-7 flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full font-semibold text-white bg-[var(--color-sky)] shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] transition-colors disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar →"}
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full px-6 py-2.5 rounded-full text-sm text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
