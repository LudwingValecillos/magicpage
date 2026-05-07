"use client";

/**
 * <CategoryCard> — large editorial category tile.
 * Cinematic hover: image scales, halo grows, arrow slides.
 */

import Link from "next/link";
import type { Category } from "@/content/site";

interface CategoryCardProps {
  category: Category;
  size?: "lg" | "xl";
  className?: string;
}

export function CategoryCard({ category, size = "lg", className = "" }: CategoryCardProps) {
  const heights = {
    lg: "h-[18rem] sm:h-[22rem] md:h-[26rem]",
    xl: "h-[22rem] sm:h-[28rem] md:h-[34rem]",
  };

  return (
    <Link
      href={`/catalogo?cat=${category.slug}`}
      className={`group relative block overflow-hidden rounded-[var(--radius-xl)] glass ${heights[size]} ${className}`}
    >
      {/* gradient backdrop */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, ${category.color}55, transparent 70%), linear-gradient(180deg, transparent 30%, var(--color-ink) 100%)`,
        }}
      />

      {/* halo */}
      <div
        className="absolute -inset-20 opacity-40 group-hover:opacity-80 transition-opacity duration-700 blur-[80px]"
        style={{ background: `radial-gradient(circle, ${category.color}, transparent 60%)` }}
      />

      {/* big glyph */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[7rem] sm:text-[10rem] md:text-[14rem] leading-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 drop-shadow-2xl"
          style={{ filter: `drop-shadow(0 20px 40px ${category.color}80)` }}
        >
          {category.icon}
        </span>
      </div>

      {/* meta strip */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[0.65rem] sm:text-[0.7rem] font-mono uppercase tracking-widest text-[var(--color-ivory-dim)] mb-1.5 sm:mb-2">
            {category.count} productos
          </span>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-[var(--color-ivory)] truncate" style={{ fontFamily: "var(--font-display)" }}>
            {category.name}
          </h3>
        </div>
        <span
          className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-lg sm:text-xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: category.color }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
