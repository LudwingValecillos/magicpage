/**
 * DESIGN TOKENS — "Magic Premium Infantil".
 *
 * Identity inspired by the Magic Instagram brand: dark premium ink,
 * dominant electric blue, vibrant pink as accent only, vibrant licensed
 * characters (Disney/Marvel/Stitch/Frozen) get their own brand glow.
 *
 *   - background: deep navy ink (NOT pure black)
 *   - text: warm white (NOT pure white)
 *   - PRIMARY: electric blue — used for CTAs, highlights, glow, hovers
 *   - ACCENT: vibrant pink — sparingly, for promos, badges, fantasy details
 *   - SUPPORTING: violet glow + gold sparkle
 *
 * Mirrors CSS variables in src/app/globals.css.
 */

export const colors = {
  // base — deep navy ink (premium dark, never pure black)
  ink: "#0B1020",
  inkSoft: "#111827",
  inkRaised: "#151A2E",
  inkLifted: "#1E2540",

  // text — warm white (never pure)
  ivory: "#F8FAFC",
  ivoryDim: "#C7CEDF",
  ivoryMute: "#7E889F",

  // PRIMARY — electric blue (dominant)
  blue: "#4DA8FF",
  blueDeep: "#3B82F6",
  blueSoft: "#60A5FA",
  blueGlow: "rgba(77, 168, 255, 0.5)",

  // ACCENT — vibrant pink (sparingly)
  pink: "#FF5FA2",
  pinkSoft: "#FF77C8",
  pinkDeep: "#F472B6",

  // SUPPORTING
  violet: "#8B5CF6",
  gold: "#FFD66B",

  // ui
  rule: "#1F2945",
  glass: "rgba(255, 255, 255, 0.04)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
} as const;

/**
 * Brand-specific glows for licensed characters / themed sections.
 * Used by CategoryCard and themed banners.
 */
export const brandGlow = {
  marvel: "#FF3B3B",
  disney: "#4DA8FF",
  stitch: "#5BC0EB",
  frozen: "#9DD0FF",
  pixar: "#FFB84D",
  lego: "#FFD93D",
  nintendo: "#E60012",
} as const;

export const fonts = {
  /** Bold, modern, slightly playful display. */
  display: '"Outfit", "Plus Jakarta Sans", system-ui, sans-serif',
  /** Clean reading body. */
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  /** Tiny labels only. */
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const motion = {
  ease: "cubicBezier(0.2, 0.8, 0.2, 1)",
  easeSlow: "cubicBezier(0.16, 1, 0.3, 1)",
  easeSnap: "cubicBezier(0.7, 0, 0.3, 1)",
  duration: 900,
  stagger: 60,
} as const;

export const space = {
  gutter: "clamp(1.25rem, 4vw, 3rem)",
  section: "clamp(3.5rem, 10vh, 9rem)",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.75rem",
  xl: "2.5rem",
  pill: "999px",
} as const;

/**
 * Gradients — single source of truth for the page-wide gradient language.
 */
export const gradients = {
  /** Primary CTA / highlight. */
  blue: "linear-gradient(135deg, #3B82F6, #60A5FA)",
  /** Promo / fantasy / pink moments. */
  pink: "linear-gradient(135deg, #FF5FA2, #F472B6)",
  /** Page-wide background base. */
  ink: "linear-gradient(180deg, #0B1020, #111827)",
  /** Big hero / promo glow combo (use sparingly). */
  glow: "linear-gradient(135deg, #4DA8FF, #FF77C8)",
  /** Triple gradient for headlines. */
  hero: "linear-gradient(120deg, #4DA8FF 0%, #8B5CF6 50%, #FF5FA2 100%)",
} as const;
