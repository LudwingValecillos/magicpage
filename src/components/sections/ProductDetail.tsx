"use client";

/**
 * ProductDetail — light. Gallery + info + WhatsApp inquiry + relacionados.
 * Lee del store por slug. Si todavía hidrata, muestra skeleton.
 */

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/Badge";
import { MagicButton } from "@/components/ui/MagicButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProducts } from "@/lib/store/useProducts";
import { useCart } from "@/lib/store/useCart";
import { useStore } from "@/lib/store/StoreProvider";
import { productInquiry, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/content/site";

export function ProductDetail({ slug }: { slug: string }) {
  const { ready } = useStore();
  const { findBySlug, visibles } = useProducts();
  const { add, open: openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [thumb, setThumb] = useState(0);

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="text-sm text-[var(--color-ink-mute)] uppercase tracking-widest font-mono">
          Cargando...
        </span>
      </div>
    );
  }

  const product = findBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <span className="text-6xl">🔎</span>
          <h1 className="display text-4xl mt-4">Producto no encontrado</h1>
          <p className="mt-3 text-[var(--color-ink-soft)]">
            El producto &ldquo;{slug}&rdquo; no existe o fue desactivado.
          </p>
          <div className="mt-8">
            <MagicButton href="/catalogo" variant="primary">
              Ver catálogo
            </MagicButton>
          </div>
        </div>
      </div>
    );
  }

  const categoriaInfo = site.categorias.find((c) => c.slug === product.categoria);
  const related = visibles
    .filter((p) => p.categoria === product.categoria && p.slug !== product.slug)
    .slice(0, 4);
  const images = product.imagenes ?? [];
  const hasImages = images.length > 0;

  const handleAdd = () => {
    add(product.slug, qty);
    openCart();
  };

  return (
    <article
      className="relative px-[var(--gutter)] pb-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3rem, 8vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        {/* breadcrumb */}
        <Reveal y={12} className="text-xs uppercase tracking-widest text-[var(--color-ink-mute)] mb-6">
          <Link href="/" className="hover:text-[var(--color-sky-deep)] transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/catalogo?cat=${product.categoria}`}
            className="hover:text-[var(--color-sky-deep)] transition-colors"
          >
            {categoriaInfo?.nombre ?? product.categoria}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-ink)]">{product.nombre}</span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* gallery */}
          <Reveal y={32} className="lg:col-span-7">
            <div className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden card bg-[var(--color-bg-tint)]">
              {hasImages ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={images[thumb].url}
                  alt={product.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <span
                    className="text-[8rem] sm:text-[10rem] float-soft"
                    style={{ filter: "drop-shadow(0 12px 32px rgba(28,36,52,0.15))" }}
                  >
                    {categoriaInfo?.emoji ?? "✦"}
                  </span>
                </div>
              )}

              <div className="absolute top-5 left-5 flex flex-col gap-1.5">
                {product.oferta && <Badge variant="oferta">Oferta</Badge>}
                {product.marca === "disney" && <Badge variant="disney">Disney</Badge>}
                {product.marca === "marvel" && <Badge variant="marvel">Marvel</Badge>}
              </div>
            </div>

            {hasImages && images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setThumb(i)}
                    className={`aspect-square rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${
                      thumb === i
                        ? "border-[var(--color-sky)]"
                        : "border-[var(--color-rule)] hover:border-[var(--color-sky-soft)]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          {/* info */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal y={24}>
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ink-mute)]">
                {categoriaInfo?.nombre ?? product.categoria}
              </span>
              <h1 className="display text-[clamp(1.75rem,4vw,3rem)] mt-2 leading-tight text-[var(--color-ink)]">
                {product.nombre}
              </h1>

              <div className="mt-6 flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-4xl md:text-5xl text-[var(--color-sky-deep)]">
                  ${product.precio.toLocaleString("es-AR")}
                </span>
                {product.oferta && product.precioAnterior && (
                  <span className="text-lg text-[var(--color-ink-mute)] line-through">
                    ${product.precioAnterior.toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              {product.descripcion && (
                <p className="mt-5 text-[var(--color-ink-soft)] leading-relaxed">
                  {product.descripcion}
                </p>
              )}

              {/* qty + add */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center bg-white border border-[var(--color-rule)] rounded-full self-start sm:self-auto">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Restar"
                    className="w-10 h-10 grid place-items-center text-[var(--color-ink)] hover:bg-[var(--color-bg-tint)] rounded-l-full transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Sumar"
                    className="w-10 h-10 grid place-items-center text-[var(--color-ink)] hover:bg-[var(--color-bg-tint)] rounded-r-full transition-colors"
                  >
                    +
                  </button>
                </div>
                <MagicButton
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAdd}
                  icon={<span aria-hidden>🛒</span>}
                >
                  Agregar al carrito
                </MagicButton>
              </div>

              <a
                href={whatsappLink(productInquiry(product))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold shadow-[0_10px_24px_-10px_rgba(37,211,102,0.55)] hover:bg-[#1ebe57] transition-colors"
              >
                <WhatsappIcon /> Consultar por WhatsApp
              </a>

              {/* perks */}
              <div className="mt-8 grid grid-cols-3 gap-2">
                <Perk icon="🏬" label="Retiro" value="En el local" />
                <Perk icon="🚚" label="Envío" value="A coordinar" />
                <Perk icon="✅" label="Original" value="Licenciado" />
              </div>
            </Reveal>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 md:mt-28">
            <Reveal y={24} className="mb-8">
              <span className="eyebrow">Te puede gustar</span>
              <h2 className="display text-[clamp(1.75rem,4vw,2.5rem)] mt-2">
                Más de{" "}
                <span className="gradient-text-pink">
                  {categoriaInfo?.nombre ?? product.categoria}
                </span>
                .
              </h2>
            </Reveal>
            <Reveal stagger={80} y={32} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </article>
  );
}

function Perk({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="card p-3 flex flex-col items-center text-center">
      <span className="text-xl">{icon}</span>
      <span className="mt-1 text-[0.65rem] font-mono uppercase tracking-wider text-[var(--color-ink-mute)]">
        {label}
      </span>
      <span className="text-xs text-[var(--color-ink)] font-semibold">{value}</span>
    </div>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.5 2.1 7.9L.2 31.6l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5C31.5 7.3 24.6.4 16 .4zm0 28.2c-2.3 0-4.6-.6-6.6-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.3-2-2-4.4-2-6.7C3.2 8.8 8.9 3.1 16 3.1c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.7-12.8 12.7zm7-9.5c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5-.1-.7l-1.2-2.9c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1.1.5s-1.4 1.4-1.4 3.4 1.5 4 1.7 4.3c.2.3 3 4.6 7.2 6.4 1 .4 1.8.7 2.4.9.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.1-.3-.2-.7-.4z" />
    </svg>
  );
}
