/**
 * Marquee — pure-CSS infinite ticker for brand vibe between sections.
 */

const words = ["Marvel", "✦", "Disney", "✦", "LEGO", "✦", "Nintendo", "✦", "Pixar", "✦", "Hot Wheels", "✦"];

export function Marquee() {
  const items = [...words, ...words, ...words];
  return (
    <section className="relative border-y border-[var(--color-rule)] overflow-hidden py-6 my-4">
      <div className="flex gap-12 whitespace-nowrap will-change-transform marquee">
        {items.map((w, i) => (
          <span
            key={i}
            className="font-display text-[clamp(2rem,5vw,4rem)] text-[var(--color-ivory-dim)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
