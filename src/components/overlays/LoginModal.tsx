"use client";

/**
 * LoginModal — admin login form.
 * Demo credentials: admin / admin (see useAuth).
 * On success → redirects to /admin and closes.
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="relative w-full max-w-md glass-strong rounded-[var(--radius-lg)] overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        {/* glow header */}
        <div className="relative px-7 py-8 border-b border-white/10">
          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-50 blur-3xl"
            style={{ background: "var(--color-blue)" }}
          />
          <div className="relative">
            <span className="eyebrow">Acceso restringido</span>
            <h2 className="display text-3xl mt-2">Panel de admin</h2>
            <p className="mt-2 text-sm text-[var(--color-ivory-dim)]">
              Iniciá sesión para gestionar el catálogo.
            </p>
          </div>
        </div>

        {/* fields */}
        <div className="px-7 py-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              Usuario
            </span>
            <input
              autoFocus
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              className="glass rounded-full px-5 py-3 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)] outline-none focus:bg-white/10 focus:border-[var(--color-blue)] border border-white/10 transition-colors"
              placeholder="admin"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              Contraseña
            </span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="glass rounded-full px-5 py-3 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-mute)] outline-none focus:bg-white/10 focus:border-[var(--color-blue)] border border-white/10 transition-colors"
              placeholder="••••••"
            />
          </label>

          {error && (
            <div className="text-xs text-[var(--color-pink)] bg-[var(--color-pink)]/10 border border-[var(--color-pink)]/30 rounded-2xl px-4 py-2">
              {error}
            </div>
          )}

          <div className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] text-center mt-2">
            Demo: <span className="text-[var(--color-blue)]">admin</span> / <span className="text-[var(--color-blue)]">admin</span>
          </div>
        </div>

        {/* actions */}
        <div className="px-7 pb-7 flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)] shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)] hover:shadow-[0_12px_36px_-8px_rgba(96,165,250,0.85)] transition-all disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar →"}
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full px-6 py-3 rounded-full text-sm text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
