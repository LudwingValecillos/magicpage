"use client";

/**
 * <ProductCard> — premium product card.
 * Glassmorphic surface, gradient halo on hover, image lift, badges.
 * Image is rendered as a stylized SVG placeholder so the scaffold runs
 * with no asset pipeline; swap for <Image> when real product art exists.
 */

import Link from "next/link";
import { Badge } from "./Badge";
import type { Product } from "@/content/site";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className={`group relative block rounded-[var(--radius-lg)] overflow-hidden glass transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(138,91,255,0.5)] ${className}`}
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
        <ProductGlyph color={product.accent} icon={product.icon} />

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges?.map((b) => (
            <Badge key={b} variant={b}>
              {b === "new" ? "Nuevo" : b === "hot" ? "Top" : b === "sale" ? "Oferta" : "Exclusivo"}
            </Badge>
          ))}
        </div>

        {/* quick view */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-[var(--color-ivory)] text-[var(--color-ink)]">
            Ver →
          </span>
        </div>
      </div>

      {/* meta */}
      <div className="p-5 flex flex-col gap-2">
        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
          {product.category}
        </span>
        <h3 className="font-display text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-semibold gradient-text">${product.price.toLocaleString()}</span>
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
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "text-[var(--color-gold)]" : "text-[var(--color-ivory-mute)]/30"}>
          ★
        </span>
      ))}
    </div>
  );
}
