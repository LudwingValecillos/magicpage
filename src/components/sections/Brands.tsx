"use client";

/**
 * Brands — carrusel de marcas/personajes que vendemos.
 * Marquee infinito continuo con embla-carousel + plugin AutoScroll.
 * Loop seamless (embla clona slides), pausa al hover, drag libre.
 * Respeta prefers-reduced-motion: sin auto-scroll, queda como fila arrastrable.
 */

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Reveal } from "@/components/Reveal";

const CDN = "https://magicstore.com.ar/wp-content/uploads/2025/06";

interface Brand {
  nombre: string;
  src: string;
}

const brands: Brand[] = [
  { nombre: "Mickey Mouse",  src: `${CDN}/Sin-titulo-2-09-150x150.webp` },
  { nombre: "Minnie Mouse",  src: `${CDN}/Sin-titulo-2-08-150x150.webp` },
  { nombre: "Stitch",        src: `${CDN}/Sin-titulo-2-03-150x150.webp` },
  { nombre: "Toy Story",     src: `${CDN}/Sin-titulo-2-11-150x150.webp` },
  { nombre: "Rey León",      src: `${CDN}/Sin-titulo-2-12-150x150.webp` },
  { nombre: "Princesas",     src: `${CDN}/logo_web_princesa-150x150.webp` },
  { nombre: "Intensamente",  src: `${CDN}/logo_intensamente-01-150x150.webp` },
  { nombre: "Spider-Man",    src: `${CDN}/logo-spider-01-01-150x150.webp` },
  { nombre: "Avengers",      src: `${CDN}/logo-avengers-01-150x150.webp` },
  { nombre: "Batman",        src: `${CDN}/LOGO_BATMAN-01.png-150x150.webp` },
  { nombre: "Superman",      src: `${CDN}/LOGO_SUPERMAN-01.png-150x150.webp` },
  { nombre: "Harry Potter",  src: `${CDN}/harry-potter-original.png-150x150.webp` },
  { nombre: "Paw Patrol",    src: `${CDN}/Sin-titulo-2-07-150x150.webp` },
  { nombre: "Bluey",         src: `${CDN}/bluey-1-150x150.jpg` },
  { nombre: "Hello Kitty",   src: `${CDN}/hello-kitty-150x150.webp` },
  { nombre: "Kuromi",        src: `${CDN}/kuromi-150x150.webp` },
  { nombre: "We Bare Bears", src: `${CDN}/WE-BARE-BEARS-01.png-150x150.webp` },
  { nombre: "Sonic",         src: `${CDN}/logo-sonic-01-150x150.webp` },
];

export function Brands() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [emblaRef] = useEmblaCarousel(
    // Marquee puro: loop, sin drag (el drag libre genera momentum que "rebota").
    { loop: true, align: "start", containScroll: false, watchDrag: false },
    reduce
      ? []
      : [
          AutoScroll({
            speed: 1.1,
            startDelay: 0,
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ],
  );

  return (
    <section
      id="marcas"
      className="relative px-[var(--gutter)] py-[var(--section)] overflow-hidden"
      style={{
        ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)",
        ["--section" as string]: "clamp(2.5rem, 6vh, 4.5rem)",
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        <Reveal y={24} className="text-center mb-8">
          <span className="eyebrow">Personajes oficiales</span>
          <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)] mt-3">
            Las <span className="gradient-text-sky">marcas</span> que vendemos.
          </h2>
        </Reveal>
      </div>

      <div
        className="-mx-[var(--gutter)] overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="overflow-hidden px-[var(--gutter)]" ref={emblaRef}>
          {/* Patrón de spacing oficial de embla: el track tiene margin-left
              negativo y cada slide aporta su propio padding-left. Así el
              espaciado se mantiene parejo incluso al loopear (sin gap de flex). */}
          <div
            className="flex py-4"
            style={{ ["--space" as string]: "2.75rem", marginLeft: "calc(var(--space) * -1)" }}
          >
            {brands.map((b) => (
              <div
                key={b.nombre}
                className="shrink-0 grow-0 min-w-0 flex justify-center"
                style={{ paddingLeft: "var(--space)" }}
              >
                <div
                  className="group/brand w-20 sm:w-24 aspect-square grid place-items-center rounded-full bg-white border border-[var(--color-rule)] shadow-[var(--shadow-soft)] transition-transform duration-300 ease-[var(--ease-out-quart)] hover:scale-105"
                  title={b.nombre}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.src}
                    alt={b.nombre}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
