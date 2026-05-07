/**
 * Named easings for anime.js v4.
 * Re-export so components don't hand-write cubic-bezier strings.
 */

export const easings = {
  reveal: "cubicBezier(0.2, 0.8, 0.2, 1)",
  slow: "cubicBezier(0.16, 1, 0.3, 1)",
  snap: "cubicBezier(0.7, 0, 0.3, 1)",
  drift: "linear",
} as const;

export type EasingName = keyof typeof easings;
