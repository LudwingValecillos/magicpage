"use client";

/**
 * AdminShell — light layout para todo /admin/*.
 *  - guard: redirige a /login si no es admin
 *  - sidebar nav colapsable en mobile
 *  - top bar con logout
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/useAuth";
import { useStore } from "@/lib/store/StoreProvider";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/productos", label: "Productos", icon: "🛍️" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();
  const { isAdmin, logout, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-ink-mute)] text-sm uppercase tracking-widest">
        Cargando...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-ink-mute)] text-sm uppercase tracking-widest">
        Redirigiendo a /login...
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* sidebar desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[var(--color-rule)] bg-white">
        <div className="px-6 py-5 border-b border-[var(--color-rule)]">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-pink)] grid place-items-center text-base text-white shadow-[var(--shadow-soft)]">
              ✦
            </span>
            <span className="font-display text-lg text-[var(--color-ink)]">Magic</span>
          </Link>
          <span className="block mt-2 text-[0.65rem] uppercase tracking-widest text-[var(--color-sky-deep)] font-semibold">
            Panel admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[var(--color-rule)]">
          <SessionBlock user={session?.user ?? "admin"} onLogout={handleLogout} />
        </div>
      </aside>

      {/* mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[17rem] bg-white border-r border-[var(--color-rule)] flex flex-col transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-5 py-5 border-b border-[var(--color-rule)] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-pink)] grid place-items-center text-base text-white">
                ✦
              </span>
              <span className="font-display text-lg text-[var(--color-ink)]">Magic</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-9 h-9 grid place-items-center text-[var(--color-ink-soft)]"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(pathname, item.href)}
              />
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-[var(--color-rule)]">
            <SessionBlock user={session?.user ?? "admin"} onLogout={handleLogout} />
          </div>
        </aside>
      </div>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-rule)] px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)]"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <span className="text-xs uppercase tracking-widest text-[var(--color-ink-mute)] hidden sm:inline">
              {breadcrumb(pathname)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-sky-deep)] transition-colors px-3 py-1.5"
            >
              ↗ Ver tienda
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider text-[var(--color-pink-deep)] border border-[var(--color-pink-soft)] hover:bg-[var(--color-pink-tint)] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-colors ${
        active
          ? "bg-[var(--color-sky-tint)] text-[var(--color-sky-deep)] font-semibold"
          : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)]"
      }`}
    >
      <span aria-hidden>{icon}</span> {label}
    </Link>
  );
}

function SessionBlock({ user, onLogout }: { user: string; onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-[var(--color-bg-tint)] border border-[var(--color-rule)]">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-8 h-8 rounded-full bg-[var(--color-sky)] grid place-items-center text-xs font-bold text-white uppercase shrink-0">
          {user[0]}
        </span>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-[var(--color-ink)] truncate">{user}</span>
          <span className="block text-[0.6rem] uppercase tracking-widest text-[var(--color-ink-mute)]">
            sesión activa
          </span>
        </div>
      </div>
      <button
        onClick={onLogout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-pink-deep)] hover:bg-[var(--color-pink-tint)] transition-colors"
      >
        ⏻
      </button>
    </div>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function breadcrumb(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean);
  return seg.join(" / ");
}
