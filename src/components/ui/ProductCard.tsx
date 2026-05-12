"use client";

/**
 * <ProductCard> — tile light, foto producto, sin glow.
 * Click → /catalogo/[slug]. Botón "+" agrega al carrito sin navegar.
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
  const cover = product.imagenes[0]?.url;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug, 1);
    open();
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={`group relative card card-hover overflow-hidden flex flex-col ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-tint)]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.nombre}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-6xl text-[var(--color-ink-mute)]/30">
            ✦
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.oferta && <Badge variant="oferta">Oferta</Badge>}
          {product.marca === "disney" && <Badge variant="disney">Disney</Badge>}
          {product.marca === "marvel" && <Badge variant="marvel">Marvel</Badge>}
        </div>

        <button
          onClick={handleAdd}
          aria-label="Agregar al carrito"
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-[var(--color-ink)] grid place-items-center shadow-[var(--shadow-soft)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--color-sky)] hover:text-white"
        >
          +
        </button>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-[var(--color-ink-mute)]">
          {product.categoria}
        </span>
        <h3 className="font-display text-lg leading-tight text-[var(--color-ink)] line-clamp-2">
          {product.nombre}
        </h3>
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--color-sky-deep)]">
            ${product.precio.toLocaleString("es-AR")}
          </span>
          {product.oferta && product.precioAnterior && (
            <span className="text-xs text-[var(--color-ink-mute)] line-through">
              ${product.precioAnterior.toLocaleString("es-AR")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
