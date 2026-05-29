"use client";

/**
 * Brands — carrusel de marcas/personajes que vendemos.
 * Marquee infinito con los logos del sitio (CDN externo).
 * Duplica la lista 2x para que el loop sea seamless.
 */

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

const loop = [...brands, ...brands];

export function Brands() {
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
        className="brands-marquee group relative -mx-[var(--gutter)] overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="brands-track flex w-max gap-10 sm:gap-12 px-[var(--gutter)] py-4">
          {loop.map((b, i) => (
            <div
              key={`${b.nombre}-${i}`}
              className="shrink-0 w-20 sm:w-24 aspect-square grid place-items-center rounded-full bg-white border border-[var(--color-rule)] shadow-[var(--shadow-soft)] hover:scale-110 transition-transform"
              title={b.nombre}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={b.nombre}
                loading="lazy"
                width={64}
                height={64}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .brands-track {
          animation: brands-scroll 60s linear infinite;
        }
        .brands-marquee:hover .brands-track {
          animation-play-state: paused;
        }
        @keyframes brands-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .brands-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
