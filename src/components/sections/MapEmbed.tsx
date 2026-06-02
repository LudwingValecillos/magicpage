"use client";

/**
 * MapEmbed — iframe de Google Maps con la ubicación del local.
 *
 * ⚠️ DESACTIVADO por pedido del cliente: no se expone ninguna ubicación
 * física para no asociar el sitio con la marca / local. El componente queda
 * acá listo para reactivar a futuro (cuando definan una sucursal pública).
 *
 * Para reactivar:
 *   1. Descomentar `direccion` y `mapsEmbedSrc` en src/content/site.ts
 *   2. Restaurar el cuerpo original (abajo) en lugar del `return null`
 *   3. Volver a importar y usar <MapEmbed /> en Footer.tsx
 */

// import { site } from "@/content/site";

export function MapEmbed() {
  return null;

  /* --- CÓDIGO ORIGINAL (reactivar a futuro) ----------------------------
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
  ---------------------------------------------------------------------- */
}
