"use client";

/**
 * CartDrawer — slide-in panel with cart items, qty controls and totals.
 * Triggered via useCart().open() (wired to the Nav cart button).
 */

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/store/useCart";
import { MagicButton } from "@/components/ui/MagicButton";

export function CartDrawer() {
  const { items, count, subtotal, setQty, remove, clear, isOpen, close } = useCart();

  // close on Escape + lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* panel */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[90] h-full w-[min(92vw,28rem)] glass-strong border-l border-white/10 transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <span className="eyebrow">Tu carrito</span>
            <h2 className="display text-2xl mt-1">
              {count} {count === 1 ? "producto" : "productos"}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Cerrar carrito"
            className="w-10 h-10 rounded-full glass grid place-items-center text-[var(--color-ivory)] hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </header>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="text-6xl mb-4">🛍</div>
              <p className="text-[var(--color-ivory-dim)] mb-6">Tu carrito está vacío.</p>
              <MagicButton href="/catalogo" variant="primary" onClick={close}>
                Explorar catálogo
              </MagicButton>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map(({ product, qty }) => (
                <li
                  key={product.slug}
                  className="glass rounded-2xl p-3 flex items-center gap-3"
                >
                  <Link
                    href={`/producto/${product.slug}`}
                    onClick={close}
                    className="shrink-0 w-16 h-16 rounded-xl grid place-items-center text-3xl"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${product.accent}, ${product.accent}55)`,
                      boxShadow: `0 8px 24px -8px ${product.accent}aa`,
                    }}
                  >
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span style={{ filter: `drop-shadow(0 2px 4px ${product.accent})` }}>{product.icon}</span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/producto/${product.slug}`}
                      onClick={close}
                      className="block text-sm font-semibold text-[var(--color-ivory)] truncate hover:text-[var(--color-blue)] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <span className="block text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mt-0.5">
                      {product.category}
                    </span>
                    <div className="flex items-center justify-between mt-2 gap-3">
                      <div className="flex items-center glass rounded-full text-xs">
                        <button
                          onClick={() => setQty(product.slug, qty - 1)}
                          className="w-7 h-7 grid place-items-center hover:bg-white/10 rounded-l-full transition-colors"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-mono">{qty}</span>
                        <button
                          onClick={() => setQty(product.slug, qty + 1)}
                          className="w-7 h-7 grid place-items-center hover:bg-white/10 rounded-r-full transition-colors"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold gradient-text-blue">
                        ${(product.price * qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(product.slug)}
                    aria-label="Quitar"
                    className="shrink-0 w-8 h-8 rounded-full text-[var(--color-ivory-mute)] hover:text-[var(--color-pink)] hover:bg-white/5 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <footer className="border-t border-white/10 px-6 py-5 flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
                  Subtotal
                </span>
                <div className="font-display text-3xl gradient-text mt-1" style={{ fontFamily: "var(--font-display)" }}>
                  ${subtotal.toLocaleString()}
                </div>
              </div>
              <button
                onClick={clear}
                className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] hover:text-[var(--color-pink)] transition-colors"
              >
                Vaciar
              </button>
            </div>
            <MagicButton variant="primary" size="lg" className="w-full justify-center" icon={<span>→</span>}>
              Finalizar compra
            </MagicButton>
            <span className="text-center text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              Envío calculado en el checkout
            </span>
          </footer>
        )}
      </aside>
    </>
  );
}
