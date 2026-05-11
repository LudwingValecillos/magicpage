"use client";

/**
 * Floating glass navbar.
 * - Desktop: logo + primary nav + search + cart + Comprar CTA
 * - Mobile: logo + cart + hamburger
 * Wires the search/cart/login overlays via the store.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { useStore } from "@/lib/store/StoreProvider";
import { useCart } from "@/lib/store/useCart";
import { useAuth } from "@/lib/store/useAuth";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openSearch } = useStore();
  const { open: openCart, count } = useCart();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K → open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <header
      className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,80rem)] rounded-full transition-all duration-500 ${
        scrolled || open ? "glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]" : "glass"
      }`}
    >
      <div className="flex items-center justify-between px-3 md:px-6 py-2.5 md:py-3">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-violet)] to-[var(--color-pink)] grid place-items-center text-base shadow-[0_0_24px_rgba(77,168,255,0.7)] group-hover:rotate-12 transition-transform duration-500">
            ✦
          </span>
          <span className="font-display text-lg md:text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {site.brand}
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 lg:px-4 py-2 rounded-full text-sm text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            aria-label="Buscar"
            onClick={openSearch}
            className="hidden md:grid w-10 h-10 rounded-full place-items-center text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
          >
            🔍
          </button>
          <button
            aria-label="Carrito"
            onClick={openCart}
            className="relative w-10 h-10 rounded-full grid place-items-center text-[var(--color-ivory-dim)] hover:text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
          >
            🛍
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-[var(--color-blue)] text-[10px] font-bold text-white grid place-items-center px-1">
                {count}
              </span>
            )}
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex ml-2 px-4 py-2 rounded-full text-sm font-semibold glass-blue text-[var(--color-blue-soft)] border border-[var(--color-blue)]/40 hover:bg-[var(--color-blue)]/10 transition-colors"
            >
              Admin
            </Link>
          )}

          <Link
            href="/catalogo"
            className="hidden md:inline-flex ml-1 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--color-blue-deep)] to-[var(--color-blue)] text-white shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)] hover:shadow-[0_12px_32px_-8px_rgba(96,165,250,0.8)] transition-shadow"
          >
            Comprar
          </Link>

          {/* mobile hamburger */}
          <button
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full grid place-items-center text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 pb-4 pt-2">
          <button
            onClick={() => {
              setOpen(false);
              openSearch();
            }}
            className="px-4 py-3 rounded-2xl text-base text-[var(--color-ivory)] hover:bg-white/5 transition-colors text-left flex items-center gap-3"
          >
            <span>🔍</span> Buscar
          </button>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-2xl text-base text-[var(--color-ivory)] hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-2xl text-base text-[var(--color-blue-soft)] hover:bg-[var(--color-blue)]/10 transition-colors"
            >
              👑 Panel admin
            </Link>
          )}
          <Link
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="mt-2 px-5 py-3 rounded-full text-center text-sm font-semibold bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-violet)] to-[var(--color-pink)] text-white shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)]"
          >
            Comprar ahora
          </Link>
        </nav>
      </div>
    </header>
  );
}
