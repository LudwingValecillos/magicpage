/**
 * Design tokens — light + colorful + minimalist.
 * Mirror de las CSS vars en src/app/globals.css.
 */

export const colors = {
  bg: "#FFFBF5",
  bgSoft: "#FFFFFF",
  bgTint: "#FEF6EC",

  ink: "#1C2434",
  inkSoft: "#4B5570",
  inkMute: "#8A92A6",

  sky: "#3DB5E0",
  skyDeep: "#2196C2",
  skySoft: "#7DD3F0",
  skyTint: "#E8F6FC",

  pink: "#FF6BAA",
  pinkDeep: "#EC4F8E",
  pinkSoft: "#FFB3D1",
  pinkTint: "#FFEAF3",

  yellow: "#FFD93D",
  yellowDeep: "#F5C800",
  mint: "#6BCB77",
  coral: "#FF8866",

  rule: "#ECE2D2",
  ruleStrong: "#D8CDB8",
} as const;

export const radii = {
  sm: "0.625rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  pill: "999px",
} as const;

export const space = {
  gutter: "clamp(1.25rem, 4vw, 3rem)",
  section: "clamp(3rem, 8vh, 6rem)",
} as const;
