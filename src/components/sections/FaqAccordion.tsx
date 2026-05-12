"use client";

/**
 * FAQ — acordeón con preguntas frecuentes del cliente.
 */

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative px-[var(--gutter)] py-[var(--section)]"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(3rem, 8vh, 6rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-3xl mx-auto">
        <Reveal y={32} className="text-center mb-10">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 className="display text-[clamp(2rem,5vw,3.25rem)] mt-3">
            ¿En qué te <span className="gradient-text-sky">ayudamos</span>?
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {site.faq.map((item, i) => {
            const expanded = open === i;
            return (
              <div
                key={item.q}
                className="card overflow-hidden transition-colors"
                style={{ background: expanded ? "var(--color-sky-tint)" : "var(--color-bg-soft)" }}
              >
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                >
                  <span className="font-display text-lg text-[var(--color-ink)]">{item.q}</span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-sky)] text-white grid place-items-center text-base transition-transform"
                    style={{ transform: expanded ? "rotate(45deg)" : "rotate(0)" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[var(--color-ink-soft)] text-[0.95rem] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
