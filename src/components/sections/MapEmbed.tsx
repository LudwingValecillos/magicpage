"use client";

/**
 * MapEmbed — iframe de Google Maps con la ubicación del local.
 * Usa lazy loading + aspect ratio fijo para evitar CLS.
 */

import { site } from "@/content/site";

export function MapEmbed() {
  const src = site.local.mapsEmbedSrc;
  if (!src) return null;

  return (
    <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-rule)] shadow-[var(--shadow-card)] aspect-[16/10] w-full">
      <iframe
        src={src}
        title="Ubicación del local"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full border-0"
      />
    </div>
  );
}
