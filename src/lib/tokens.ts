/**
 * DESIGN TOKENS — "Magic Premium".
 * Mirrors CSS variables in src/app/globals.css.
 *
 * Direction:
 *   - dark, never pure black (purple-black ink with subtle nebula glow)
 *   - ivory text, never pure white
 *   - vibrant pink + electric blue as primary accents
 *   - violet glow + gold sparkle as supporting accents
 *   - glassmorphism + soft shadows + particles
 */

export const colors = {
  // base — purple-tinted dark
  ink: "#0B0614",
  inkSoft: "#120A22",
  inkRaised: "#1A1030",

  // text
  ivory: "#FBF7FF",
  ivoryDim: "#B5A8CC",
  ivoryMute: "#7A6F92",

  // primary accents
  pink: "#FF3D9A",
  pinkSoft: "#FF7AC0",
  blue: "#3DCBFF",
  blueSoft: "#7BE0FF",

  // supporting
  violet: "#8A5BFF",
  gold: "#FFD66B",

  // ui
  rule: "#231640",
  glass: "rgba(255, 255, 255, 0.04)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
} as const;

export const fonts = {
  display: '"Fraunces", "Times New Roman", serif',
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
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
  section: "clamp(6rem, 12vh, 10rem)",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.75rem",
  xl: "2.5rem",
  pill: "999px",
} as const;
