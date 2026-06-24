"use client";

/**
 * Nav flotante light. Logo + nav + buscar + carrito + CTA.
 * Mobile: hamburguesa.
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-[var(--z-sticky)] w-[min(94vw,72rem)] overflow-hidden [transition:background-color_.3s_var(--ease-out-quart),box-shadow_.3s_var(--ease-out-quart),border-color_.3s_var(--ease-out-quart),border-radius_.3s_var(--ease-out-quart)] border ${
        open ? "rounded-[1.75rem]" : "rounded-full"
      } ${
        scrolled || open
          ? "bg-white/95 backdrop-blur-md border-[var(--color-rule)] shadow-[var(--shadow-card)]"
          : "bg-white/80 backdrop-blur border-[var(--color-rule)]/60"
      }`}
    >
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <img
            src="/brand/fantasy-icon.webp"
            alt={site.brand}
            width={36}
            height={36}
            className="w-9 h-9 rounded-2xl bg-white p-0.5 shadow-[var(--shadow-soft)] group-hover:rotate-6 transition-transform"
          />
          <span className="font-display text-xl font-extrabold tracking-tight leading-none">
            <span className="bg-gradient-to-r from-[var(--color-sky)] via-[var(--color-pink)] to-[var(--color-pink-deep)] bg-clip-text text-transparent">
              Fantasy
            </span>{" "}
            <span className="text-[var(--color-ink)]">Store</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 lg:px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-sky-deep)] hover:bg-[var(--color-sky-tint)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            aria-label="Buscar"
            onClick={openSearch}
            className="hidden md:grid w-10 h-10 rounded-full place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            aria-label="Carrito"
            onClick={openCart}
            className="relative w-10 h-10 rounded-full grid place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-[var(--color-pink)] text-[10px] font-bold text-white grid place-items-center px-1">
                {count}
              </span>
            )}
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-bg-tint)] text-[var(--color-ink)] border border-[var(--color-rule-strong)] hover:bg-[var(--color-sky-tint)] transition-colors"
            >
              Admin
            </Link>
          )}

          <Link
            href="/catalogo"
            className="hidden md:inline-flex ml-1 px-5 py-2 rounded-full text-sm font-semibold bg-[var(--color-sky)] text-white shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] transition-colors"
          >
            Comprar
          </Link>

          <button
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full grid place-items-center text-[var(--color-ink)] hover:bg-[var(--color-bg-tint)] transition-colors"
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

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-3 pb-4 pt-1">
          <button
            onClick={() => {
              setOpen(false);
              openSearch();
            }}
            className="px-4 py-3 rounded-2xl text-base text-[var(--color-ink)] hover:bg-[var(--color-bg-tint)] transition-colors text-left"
          >
            Buscar
          </button>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-semibold text-[var(--color-ink)] hover:bg-[var(--color-bg-tint)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-2xl text-base text-[var(--color-sky-deep)] hover:bg-[var(--color-sky-tint)] transition-colors"
            >
              Panel admin
            </Link>
          )}
          <Link
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="mt-2 px-5 py-3 rounded-full text-center text-sm font-semibold bg-[var(--color-sky)] text-white shadow-[var(--shadow-sky)]"
          >
            Comprar ahora
          </Link>
        </nav>
      </div>
    </header>
  );
}
