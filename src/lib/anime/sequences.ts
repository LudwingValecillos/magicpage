/**
 * Page-load animation sequences. Run on mount, not on scroll.
 */

import { animate, stagger } from "animejs";
import { easings } from "./easings";

/** Hero intro: eyebrow → headline lines → all meta blocks. */
export function playHeroIntro(root: HTMLElement) {
  const eyebrow = root.querySelector("[data-hero='eyebrow']");
  const lines = root.querySelectorAll("[data-hero='line']");
  const metas = root.querySelectorAll("[data-hero='meta']");

  if (eyebrow) {
    animate(eyebrow, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 700,
      ease: easings.reveal,
    });
  }

  if (lines.length) {
    animate(lines, {
      opacity: [0, 1],
      translateY: [60, 0],
      duration: 1100,
      delay: stagger(120, { start: 200 }),
      ease: easings.slow,
    });
  }

  if (metas.length) {
    animate(metas, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: stagger(120, { start: 200 + lines.length * 120 + 100 }),
      ease: easings.reveal,
    });
  }
}
