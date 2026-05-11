"use client";

/**
 * ProductDetail — premium product page.
 * Now driven by the store: looks up product by slug from useProducts().
 * Gallery cycles through product.images[] (or falls back to emoji).
 */

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GradientMesh } from "@/components/visual/GradientMesh";
import { ParticleField } from "@/components/visual/ParticleField";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { Badge } from "@/components/ui/Badge";
import { MagicButton } from "@/components/ui/MagicButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { useProducts } from "@/lib/store/useProducts";
import { useCart } from "@/lib/store/useCart";
import { useStore } from "@/lib/store/StoreProvider";

export function ProductDetail({ slug }: { slug: string }) {
  const { ready } = useStore();
  const { findBySlug, visible } = useProducts();
  const { add, open: openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [thumb, setThumb] = useState(0);

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="text-[var(--color-ivory-mute)] text-sm font-mono uppercase tracking-widest">Cargando...</span>
      </div>
    );
  }

  const product = findBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <span className="text-6xl">✦</span>
          <h1 className="display text-4xl mt-4">Producto no encontrado</h1>
          <p className="mt-3 text-[var(--color-ivory-dim)]">El producto &ldquo;{slug}&rdquo; no existe o fue desactivado.</p>
          <div className="mt-8">
            <MagicButton href="/catalogo" variant="primary">Ver catálogo</MagicButton>
          </div>
        </div>
      </div>
    );
  }

  const related = visible.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug).slice(0, 4);
  const images = product.images.length ? product.images : [];
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
        ["--section" as string]: "clamp(3.5rem, 10vh, 9rem)",
      } as React.CSSProperties}
    >
      <GradientMesh variant="soft" />

      {/* breadcrumb */}
      <Reveal y={16} className="relative mb-8 text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
        <Link href="/" className="hover:text-[var(--color-ivory)] transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo?cat=${product.categorySlug}`} className="hover:text-[var(--color-ivory)] transition-colors">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-ivory)]">{product.name}</span>
      </Reveal>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* gallery */}
        <Reveal y={48} className="lg:col-span-7">
          <div
            className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden glass-strong"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${product.accent}33, transparent 70%)`,
            }}
          >
            <ParticleField density={40} hue="mixed" />
            <GlowOrb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="blue" size={460} blur={140} opacity={0.4} />

            {hasImages ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[thumb]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full grid place-items-center text-7xl sm:text-8xl md:text-9xl float-slow"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${product.accent}, ${product.accent}66)`,
                    boxShadow: `0 30px 100px -10px ${product.accent}aa, inset 0 -30px 60px rgba(0,0,0,0.35)`,
                  }}
                >
                  <span style={{ filter: `drop-shadow(0 8px 20px ${product.accent})` }}>{product.icon}</span>
                </div>
              </div>
            )}

            {/* badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.onSale && product.oldPrice && <Badge variant="sale">Oferta</Badge>}
              {product.badges?.map((b) => (
                <Badge key={b} variant={b}>
                  {b === "new" ? "Nuevo" : b === "hot" ? "Top" : b === "sale" ? "Oferta" : "Exclusivo"}
                </Badge>
              ))}
            </div>
          </div>

          {/* thumbnails (only when images exist) */}
          {hasImages && images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setThumb(i)}
                  className={`aspect-square rounded-[var(--radius-md)] overflow-hidden glass transition-all ${
                    thumb === i ? "ring-2 ring-[var(--color-blue)] glow-blue" : "hover:bg-white/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {/* info */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal y={24}>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
              {product.category}
            </span>
            <h1 className="display text-[clamp(2.25rem,5vw,4rem)] mt-2 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < product.rating ? "text-[var(--color-gold)]" : "text-[var(--color-ivory-mute)]/30"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-mono text-[var(--color-ivory-mute)]">128 reseñas</span>
            </div>

            <div className="mt-8 flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-5xl gradient-text" style={{ fontFamily: "var(--font-display)" }}>
                ${product.price.toLocaleString()}
              </span>
              {product.onSale && product.oldPrice && (
                <span className="text-lg text-[var(--color-ivory-mute)] line-through">
                  ${product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-6 text-base text-[var(--color-ivory-dim)] leading-relaxed">
              {product.description}
            </p>

            {/* qty + cta */}
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center justify-center glass rounded-full self-start sm:self-auto">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 grid place-items-center text-[var(--color-ivory)] hover:bg-white/5 rounded-l-full transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-11 grid place-items-center text-[var(--color-ivory)] hover:bg-white/5 rounded-r-full transition-colors"
                >
                  +
                </button>
              </div>
              <MagicButton variant="primary" size="lg" className="flex-1" onClick={handleAdd} icon={<span>🛍</span>}>
                Agregar al carrito
              </MagicButton>
            </div>

            <button className="mt-3 w-full glass rounded-full py-3 text-sm font-medium hover:bg-white/10 transition-colors">
              ♥ Guardar en favoritos
            </button>

            {/* details list */}
            <div className="mt-10 pt-8 border-t border-[var(--color-rule)]">
              <h3 className="text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] mb-4">
                Detalles
              </h3>
              <ul className="flex flex-col gap-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-sm text-[var(--color-ivory-dim)]">
                    <span className="text-[var(--color-blue)]">✦</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2">
              <Chip icon="🚚" label="Envío" value="24-48hs" />
              <Chip icon="↺" label="Cambio" value="30 días" />
              <Chip icon="🔒" label="Pago" value="Seguro" />
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <Reveal y={32} className="mb-10">
            <span className="eyebrow">Te puede gustar</span>
            <h2 className="display text-[clamp(2rem,5vw,4rem)] mt-3">
              Más de <span className="gradient-text">{product.category}</span>.
            </h2>
          </Reveal>
          <Reveal stagger={100} y={48} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Reveal>
        </section>
      )}
    </article>
  );
}

function Chip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="glass rounded-[var(--radius-md)] p-3 flex flex-col items-center text-center">
      <span className="text-xl">{icon}</span>
      <span className="mt-1 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
        {label}
      </span>
      <span className="text-xs text-[var(--color-ivory)] font-medium">{value}</span>
    </div>
  );
}
