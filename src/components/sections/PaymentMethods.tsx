"use client";

/**
 * PaymentMethods — tira de medios de pago.
 * Esta info antes solo vivía en el FAQ; acá se muestra visualmente.
 * Marcas dibujadas con SVG inline simples para no depender de logos externos.
 */

import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

function Mark({ id, label }: { id: string; label: string }) {
  // Glyph minimalista por medio de pago, en pill on-brand.
  const glyph: Record<string, React.ReactNode> = {
    mercadopago: <span className="text-[var(--color-sky-deep)] font-extrabold">MP</span>,
    visa: <span className="italic font-extrabold tracking-tight text-[#1a1f71]">VISA</span>,
    mastercard: (
      <span className="relative inline-flex items-center" aria-hidden="true">
        <span className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] -ml-1.5 mix-blend-multiply" />
      </span>
    ),
    transferencia: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8h13l-3-3M21 16H8l3 3" />
      </svg>
    ),
    efectivo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  };

  return (
    <div className="chip gap-2 bg-[var(--color-bg-soft)] px-3.5 py-2 text-[var(--color-ink-soft)]">
      <span className="grid place-items-center min-w-[2.2rem] text-sm">{glyph[id]}</span>
      <span className="font-semibold text-[0.85rem] whitespace-nowrap">{label}</span>
    </div>
  );
}

export function PaymentMethods() {
  return (
    <section
      aria-label="Medios de pago"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(1.5rem, 4vh, 2.5rem)",
      } as React.CSSProperties}
    >
      <Reveal y={20} className="max-w-4xl mx-auto text-center">
        <span className="label">Medios de pago</span>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {site.pagos.map((p) => (
            <Mark key={p.id} id={p.id} label={p.label} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
