"use client";

/**
 * CtaWhatsapp — banner ancho con CTA a WhatsApp genérico.
 */

import { Reveal } from "@/components/Reveal";
import { genericInquiry } from "@/lib/whatsapp";
import { useWhatsapp } from "@/lib/useWhatsapp";

export function CtaWhatsapp() {
  const { link } = useWhatsapp();
  return (
    <section
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(2rem, 6vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-5xl mx-auto">
        <Reveal y={24}>
          <div
            className="relative rounded-[var(--radius-xl)] overflow-hidden p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, var(--color-sky), var(--color-sky-deep))" }}
          >
            <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-12 w-56 h-56 rounded-full bg-[var(--color-pink-soft)]/40 blur-3xl" />

            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)] text-white relative">
              ¿Tenés alguna duda?
            </h2>
            <p className="mt-3 text-white/90 max-w-xl mx-auto relative">
              Escribinos por WhatsApp y te ayudamos a encontrar el regalo perfecto.
            </p>
            <a
              href={link(genericInquiry())}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 mt-6 px-7 py-3.5 rounded-full font-bold bg-white text-[var(--color-sky-deep)] shadow-[var(--shadow-soft)] hover:scale-105 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.5 2.1 7.9L.2 31.6l8-2.1c2.3 1.3 4.9 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5C31.5 7.3 24.6.4 16 .4zm0 28.2c-2.3 0-4.6-.6-6.6-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.3-2-2-4.4-2-6.7C3.2 8.8 8.9 3.1 16 3.1c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.7-12.8 12.7zm7-9.5c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5-.1-.7l-1.2-2.9c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1.1.5s-1.4 1.4-1.4 3.4 1.5 4 1.7 4.3c.2.3 3 4.6 7.2 6.4 1 .4 1.8.7 2.4.9.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.1-.3-.2-.7-.4z" />
              </svg>
              Hablar por WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
