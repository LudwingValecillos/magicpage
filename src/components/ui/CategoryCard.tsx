"use client";

/**
 * <CategoryCard> — tile categoría grande con emoji + hover wiggle.
 */

import Link from "next/link";
import type { CategoriaInfo } from "@/lib/store/types";

interface CategoryCardProps {
  categoria: CategoriaInfo;
  count?: number;
  className?: string;
}

export function CategoryCard({ categoria, count, className = "" }: CategoryCardProps) {
  // Categoría vacía → estado "Próximamente", no clickeable, atenuado.
  const vacia = count === 0;

  const inner = (
    <>
      <span
        className={`text-7xl sm:text-8xl mb-4 transition-transform duration-300 ease-[var(--ease-out-quart)] ${
          vacia ? "opacity-50 grayscale" : "group-hover:scale-110 group-hover:-rotate-6"
        }`}
        style={{ filter: vacia ? undefined : `drop-shadow(0 8px 20px ${categoria.color}40)` }}
      >
        {categoria.emoji}
      </span>
      <h3 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)]">
        {categoria.nombre}
      </h3>

      {vacia ? (
        <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-[var(--color-ink-mute)] bg-[var(--color-bg-tint)] border border-[var(--color-rule)]">
          Próximamente
        </span>
      ) : (
        <>
          {typeof count === "number" && (
            <span className="mt-2 text-sm text-[var(--color-ink-mute)]">
              {count} {count === 1 ? "producto" : "productos"}
            </span>
          )}
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-soft)]">
            Ver
            <span
              className="grid place-items-center w-5 h-5 rounded-full text-white text-xs transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:translate-x-1"
              style={{ background: categoria.color }}
            >
              →
            </span>
          </span>
        </>
      )}
    </>
  );

  const base = `group relative card overflow-hidden flex flex-col items-center justify-center p-8 sm:p-10 text-center min-h-[14rem] sm:min-h-[18rem] ${className}`;
  const bg = {
    background: `linear-gradient(180deg, ${categoria.color}14, transparent 70%), var(--color-bg-soft)`,
  };

  if (vacia) {
    return (
      <div
        aria-disabled="true"
        className={`${base} cursor-default opacity-80`}
        style={bg}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/catalogo?cat=${categoria.slug}`} className={`${base} card-hover`} style={bg}>
      {inner}
    </Link>
  );
}
