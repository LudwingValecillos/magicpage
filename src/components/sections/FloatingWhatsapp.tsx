"use client";

/**
 * Botón flotante de WhatsApp — visible en todas las páginas públicas.
 * Se oculta automáticamente en /admin y /checkout.
 */

import { usePathname } from "next/navigation";
import { genericInquiry } from "@/lib/whatsapp";
import { useWhatsapp } from "@/lib/useWhatsapp";

export function FloatingWhatsapp() {
  const pathname = usePathname();
  const { link } = useWhatsapp();

  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/checkout")) return null;
  if (pathname?.startsWith("/login")) return null;

  const href = link(genericInquiry());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 bg-[#25D366] text-white font-semibold rounded-full pl-3 pr-5 py-3 shadow-[0_12px_32px_-8px_rgba(37,211,102,0.55)] hover:scale-105 transition-transform duration-200"
    >
      <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.5 2.1 7.9L.2 31.6l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5C31.5 7.3 24.6.4 16 .4zm0 28.2c-2.3 0-4.6-.6-6.6-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.3-2-2-4.4-2-6.7C3.2 8.8 8.9 3.1 16 3.1c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.7-12.8 12.7zm7-9.5c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5-.1-.7l-1.2-2.9c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1.1.5s-1.4 1.4-1.4 3.4 1.5 4 1.7 4.3c.2.3 3 4.6 7.2 6.4 1 .4 1.8.7 2.4.9.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.1-.3-.2-.7-.4z" />
      </svg>
      <span className="text-sm">WhatsApp</span>
    </a>
  );
}
