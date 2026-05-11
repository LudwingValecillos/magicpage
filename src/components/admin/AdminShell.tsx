"use client";

/**
 * AdminShell — wraps every /admin/* page with:
 *  - guard: redirects to /login when not admin
 *  - sidebar nav (collapsible on mobile)
 *  - top bar with logout (clears localStorage session)
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/useAuth";
import { useStore } from "@/lib/store/StoreProvider";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◉" },
  { href: "/admin/productos", label: "Productos", icon: "◐" },
  { href: "/admin/categorias", label: "Categorías", icon: "◆" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();
  const { isAdmin, logout, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // guard
  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  // close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-ivory-mute)] text-sm font-mono uppercase tracking-widest">
        Cargando...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-ivory-mute)] text-sm font-mono uppercase tracking-widest">
        Redirigiendo a /login...
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 glass-strong">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-violet)] to-[var(--color-pink)] grid place-items-center text-base shadow-[0_0_24px_rgba(77,168,255,0.7)]">
              ✦
            </span>
            <span className="font-display text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Magic
            </span>
          </Link>
          <span className="block mt-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-blue-soft)]">
            Panel admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <SessionBlock user={session?.user ?? "admin"} onLogout={handleLogout} />
        </div>
      </aside>

      {/* mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <aside
          className={`absolute left-0 top-0 h-full w-[18rem] glass-strong border-r border-white/10 flex flex-col transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-violet)] to-[var(--color-pink)] grid place-items-center text-base">✦</span>
              <span className="font-display text-xl" style={{ fontFamily: "var(--font-display)" }}>Magic</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 grid place-items-center text-[var(--color-ivory-dim)]">✕</button>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive(pathname, item.href)} />
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-white/10">
            <SessionBlock user={session?.user ?? "admin"} onLogout={handleLogout} />
          </div>
        </aside>
      </div>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* topbar */}
        <header className="sticky top-0 z-40 glass-strong border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full glass grid place-items-center"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] hidden sm:inline">
              {breadcrumb(pathname)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] transition-colors"
            >
              ↗ Ver tienda
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-[var(--color-pink)] border border-[var(--color-pink)]/30 hover:bg-[var(--color-pink)]/10 transition-colors"
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

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-colors ${
        active
          ? "bg-gradient-to-r from-[var(--color-blue)]/20 to-[var(--color-violet)]/15 text-[var(--color-ivory)] border border-[var(--color-blue)]/40"
          : "text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5"
      }`}
    >
      <span className="text-base">{icon}</span> {label}
    </Link>
  );
}

function SessionBlock({ user, onLogout }: { user: string; onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl glass">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-violet)] grid place-items-center text-xs font-bold uppercase shrink-0">
          {user[0]}
        </span>
        <div className="min-w-0">
          <span className="block text-xs font-semibold truncate">{user}</span>
          <span className="block text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
            sesión activa
          </span>
        </div>
      </div>
      <button
        onClick={onLogout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-[var(--color-ivory-dim)] hover:text-[var(--color-pink)] hover:bg-white/5 transition-colors"
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
