"use client";

/**
 * CartDrawer — slide-in panel light. Items con imagen + qty + total.
 * Checkout = link a WhatsApp con el pedido pre-armado.
 */

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/store/useCart";
import { useStore } from "@/lib/store/StoreProvider";
import { MagicButton } from "@/components/ui/MagicButton";
import { checkoutMessageFromCart, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/content/site";

export function CartDrawer() {
  const { items, count, subtotal, setQty, remove, clear, isOpen, close } = useCart();
  const { cart, products } = useStore();

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

  const checkoutHref = whatsappLink(
    checkoutMessageFromCart(
      { nombre: "—", telefono: "—", entrega: "retiro", pago: "otra" },
      cart,
      products,
      subtotal,
    ),
  );

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[80] bg-[var(--color-ink)]/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[90] h-full w-[min(92vw,26rem)] bg-[var(--color-bg-soft)] border-l border-[var(--color-rule)] shadow-[-20px_0_60px_-20px_rgba(28,36,52,0.25)] [transition:transform_.45s_var(--ease-drawer)] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-rule)]">
          <div>
            <span className="eyebrow">Tu carrito</span>
            <h2 className="font-display text-xl mt-1 text-[var(--color-ink)]">
              {count} {count === 1 ? "producto" : "productos"}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-full grid place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-tint)] transition-colors"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-[var(--color-ink-soft)] mb-6">Tu carrito está vacío.</p>
              <MagicButton href="/catalogo" variant="primary" onClick={close}>
                Explorar catálogo
              </MagicButton>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map(({ product, qty }) => {
                const cover = product.imagenes[0]?.url;
                const cat = site.categorias.find((c) => c.slug === product.categoria);
                return (
                  <li
                    key={product.slug}
                    className="card p-3 flex items-center gap-3 [animation:fade-img_.35s_var(--ease-out-quart)_both]"
                  >
                    <Link
                      href={`/producto/${product.slug}`}
                      onClick={close}
                      className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-bg-tint)] grid place-items-center"
                    >
                      {cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover}
                          alt={product.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{cat?.emoji ?? "✦"}</span>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${product.slug}`}
                        onClick={close}
                        className="block text-sm font-semibold text-[var(--color-ink)] truncate hover:text-[var(--color-sky-deep)] transition-colors"
                      >
                        {product.nombre}
                      </Link>
                      <span className="block text-[0.65rem] uppercase tracking-wider text-[var(--color-ink-mute)] mt-0.5">
                        {cat?.nombre ?? product.categoria}
                      </span>
                      <div className="flex items-center justify-between mt-2 gap-3">
                        <div className="flex items-center bg-white border border-[var(--color-rule)] rounded-full text-xs">
                          <button
                            onClick={() => setQty(product.slug, qty - 1)}
                            className="w-7 h-7 grid place-items-center hover:bg-[var(--color-bg-tint)] rounded-l-full transition-colors"
                            aria-label="Disminuir"
                          >
                            −
                          </button>
                          <span className="w-7 text-center font-semibold">{qty}</span>
                          <button
                            onClick={() => setQty(product.slug, qty + 1)}
                            className="w-7 h-7 grid place-items-center hover:bg-[var(--color-bg-tint)] rounded-r-full transition-colors"
                            aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[var(--color-ink)]">
                          ${(product.precio * qty).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(product.slug)}
                      aria-label="Quitar"
                      className="shrink-0 w-8 h-8 rounded-full text-[var(--color-ink-mute)] hover:text-[var(--color-pink-deep)] hover:bg-[var(--color-pink-tint)] transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[var(--color-rule)] px-5 py-4 flex flex-col gap-3 bg-white">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)]">
                  Subtotal
                </span>
                <div className="font-display text-2xl text-[var(--color-ink)] mt-0.5">
                  ${subtotal.toLocaleString("es-AR")}
                </div>
              </div>
              <button
                onClick={clear}
                className="text-xs uppercase tracking-wider text-[var(--color-ink-mute)] hover:text-[var(--color-pink-deep)] transition-colors"
              >
                Vaciar
              </button>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-[var(--color-sky)] shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] transition-colors"
            >
              Finalizar compra →
            </Link>
            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-[#075E54] bg-[#25D366]/15 hover:bg-[#25D366]/25 transition-colors"
            >
              📱 Consultar por WhatsApp
            </a>
            <span className="text-center text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)]">
              Confirmamos disponibilidad y pago por WhatsApp
            </span>
          </footer>
        )}
      </aside>
    </>
  );
}
