"use client";

/**
 * <ProductCard> — premium product card.
 * Renders the first image if present, otherwise the emoji glyph fallback.
 * The card is a Link to the product page; the add-to-cart button stops
 * propagation so it doesn't navigate.
 */

import Link from "next/link";
import { Badge } from "./Badge";
import { useCart } from "@/lib/store/useCart";
import type { Product } from "@/lib/store/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { add, open } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug, 1);
    open();
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={`group relative block rounded-[var(--radius-lg)] overflow-hidden glass transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(77,168,255,0.5)] ${className}`}
    >
      {/* glow halo on hover */}
      <div
        className="absolute -inset-px rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${product.accent}, transparent 70%)`,
        }}
      />

      {/* image area */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${product.accent}33, transparent 70%)`,
        }}
      >
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <ProductGlyph color={product.accent} icon={product.icon} />
        )}

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.onSale && product.oldPrice && <Badge variant="sale">Oferta</Badge>}
          {product.badges?.map((b) => (
            <Badge key={b} variant={b}>
              {b === "new" ? "Nuevo" : b === "hot" ? "Top" : b === "sale" ? "Oferta" : "Exclusivo"}
            </Badge>
          ))}
        </div>

        {/* add to cart */}
        <button
          onClick={handleAdd}
          aria-label="Agregar al carrito"
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[var(--color-ivory)] text-[var(--color-ink)] grid place-items-center text-base shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 hover:bg-[var(--color-blue)] hover:text-white"
        >
          +
        </button>
      </div>

      {/* meta */}
      <div className="p-5 flex flex-col gap-2">
        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
          {product.category}
        </span>
        <h3 className="font-display text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1 gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-lg font-semibold gradient-text-blue truncate">
              ${product.price.toLocaleString()}
            </span>
            {product.onSale && product.oldPrice && (
              <span className="text-xs text-[var(--color-ivory-mute)] line-through">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Stars rating={product.rating} />
        </div>
      </div>
    </Link>
  );
}

function ProductGlyph({ color, icon }: { color: string; icon: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center text-6xl float-slow"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
          boxShadow: `0 20px 60px -10px ${color}80, inset 0 -20px 40px rgba(0,0,0,0.3)`,
        }}
      >
        <span className="drop-shadow-lg">{icon}</span>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex gap-0.5 shrink-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "text-[var(--color-gold)]" : "text-[var(--color-ivory-mute)]/30"}>
          ★
        </span>
      ))}
    </div>
  );
}
