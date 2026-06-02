"use client";

/**
 * Footer — datos de contacto, redes, Google Maps embebido, legal.
 */

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
// MapEmbed oculto por pedido del cliente (ubicación física). Reactivar a futuro:
// import { MapEmbed } from "./MapEmbed";
import { site } from "@/content/site";
import { genericInquiry, whatsappLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const socials = [
    site.local.instagram && { label: "Instagram", href: site.local.instagram, icon: "ig" },
    site.local.facebook && { label: "Facebook", href: site.local.facebook, icon: "fb" },
    site.local.tiktok && { label: "TikTok", href: site.local.tiktok, icon: "tt" },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: string }>;

  return (
    <footer
      id="local"
      className="relative mt-12 pt-16 pb-10 px-[var(--gutter)] border-t border-[var(--color-rule)] bg-[var(--color-bg-soft)]"
      style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <Reveal y={24}>
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-pink)] grid place-items-center text-base text-white shadow-[var(--shadow-soft)] group-hover:rotate-6 transition-transform">
              ✦
            </span>
            <span className="font-display text-2xl text-[var(--color-ink)]">{site.brand}</span>
          </Link>
          <p className="mt-4 text-[var(--color-ink-soft)] max-w-md leading-relaxed">
            {site.tagline}
          </p>

          <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--color-ink-soft)]">
            {/* --- DIRECCIÓN OCULTA (pedido del cliente) ----------------------
                No se muestra la ubicación física para no exponer la marca.
                Reactivar junto con site.local.direccion cuando haya sucursal:
            <div className="flex items-start gap-2">
              <span aria-hidden>📍</span>
              <span>{site.local.direccion}</span>
            </div>
                ---------------------------------------------------------------- */}
            <div className="flex items-start gap-2">
              <span aria-hidden>🕒</span>
              <span>{site.local.horarios}</span>
            </div>
            {WHATSAPP_NUMBER && (
              <a
                href={whatsappLink(genericInquiry())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-sky-deep)] font-semibold hover:underline"
              >
                <span aria-hidden>💬</span> WhatsApp
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-[var(--color-rule-strong)] grid place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-sky)] hover:text-white hover:border-[var(--color-sky)] transition-colors"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal y={24} delay={120}>
          {/* --- MAPA / UBICACIÓN OCULTOS (pedido del cliente) ---------------
              Se quitó el Google Maps embebido para no exponer la ubicación
              física. Reactivar junto con site.local.mapsEmbedSrc cuando haya
              una sucursal pública:
          <MapEmbed />
              ---------------------------------------------------------------- */}
          <div className="card p-6 flex flex-col items-start gap-3 h-full justify-center">
            <span className="text-3xl" aria-hidden>💬</span>
            <h3 className="font-display text-xl text-[var(--color-ink)]">
              Te atendemos por WhatsApp
            </h3>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              Coordinamos pago y entrega directamente por chat. Escribinos y te
              respondemos a la brevedad.
            </p>
            {WHATSAPP_NUMBER && (
              <a
                href={whatsappLink(genericInquiry())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-[#25D366] shadow-[0_10px_24px_-10px_rgba(37,211,102,0.55)] hover:bg-[#1ebe57] transition-colors"
              >
                📱 Escribinos
              </a>
            )}
          </div>
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[var(--color-rule)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-ink-mute)]">
        <span>{site.footer.legal}</span>
        <span>Hecho con ♥</span>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "ig") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (name === "fb") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
      </svg>
    );
  }
  if (name === "tt") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.6 7.4a6.7 6.7 0 0 1-3.9-1.3v9.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v3a2.7 2.7 0 1 0 1.9 2.6V2h2.9a4.8 4.8 0 0 0 4.8 4.8v0.6h-0.9z" />
      </svg>
    );
  }
  return null;
}
