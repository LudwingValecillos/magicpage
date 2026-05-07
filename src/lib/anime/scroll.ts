/**
 * Scroll-triggered animation primitives.
 *
 * Uses IntersectionObserver (deterministic across browsers) to gate
 * anime.js v4 animations. We avoid anime.js's `onScroll` because its
 * threshold-string syntax is brittle and fails silently if mistyped.
 *
 * USAGE
 *   const ctx = revealOnScroll(ref.current, { y: 40, stagger: 60 });
 *   return () => ctx?.revert();
 */

import { animate, stagger as animeStagger } from "animejs";
import { easings } from "./easings";

export interface RevealOptions {
  /** Pixels of vertical translation at start. Default 32. */
  y?: number;
  /** Stagger between children in ms. 0 disables staggering. Default 0. */
  stagger?: number;
  /** Reveal duration in ms. Default 900. */
  duration?: number;
  /** Delay before the first element animates, in ms. Default 0. */
  delay?: number;
  /** Easing name. Default "reveal". */
  ease?: keyof typeof easings;
  /** Children selector when staggering. Default ":scope > *". */
  childSelector?: string;
  /** % of element that must be visible to trigger. Default 0.12. */
  threshold?: number;
  /** Pixels of root margin (negative = trigger earlier). Default -40. */
  rootMargin?: number;
  /** Re-run when element re-enters. Default false (one-shot). */
  repeat?: boolean;
}

interface RevealHandle {
  revert: () => void;
}

export function revealOnScroll(target: Element | null, opts: RevealOptions = {}): RevealHandle | null {
  if (!target || typeof window === "undefined") return null;

  const {
    y = 32,
    stagger = 0,
    duration = 900,
    delay = 0,
    ease = "reveal",
    childSelector = ":scope > *",
    threshold = 0.12,
    rootMargin = -40,
    repeat = false,
  } = opts;

  const els: HTMLElement[] =
    stagger > 0
      ? Array.from(target.querySelectorAll<HTMLElement>(childSelector))
      : [target as HTMLElement];

  if (els.length === 0) return null;

  // Set initial state inline so it's painted before the observer fires.
  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    el.style.willChange = "opacity, transform";
  });

  let played = false;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (played && !repeat) continue;
          played = true;

          animate(els, {
            opacity: [0, 1],
            translateY: [y, 0],
            duration,
            delay: stagger > 0 ? animeStagger(stagger, { start: delay }) : delay,
            ease: easings[ease],
          });

          if (!repeat) observer.disconnect();
        }
      }
    },
    {
      threshold,
      rootMargin: `0px 0px ${rootMargin}px 0px`,
    },
  );

  observer.observe(target);

  return {
    revert: () => {
      observer.disconnect();
      els.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.willChange = "";
      });
    },
  };
}

export interface ParallaxOptions {
  /** Translation distance in pixels across scroll range. Default 120. */
  distance?: number;
  /** Horizontal instead of vertical. Default false. */
  horizontal?: boolean;
}

interface ParallaxHandle {
  revert: () => void;
}

/**
 * Drives a transform from the scroll position. Synchronous — runs while
 * the element is in view. Implemented with rAF + IntersectionObserver
 * so it's cheap when the target is offscreen.
 */
export function parallaxOnScroll(target: Element | null, opts: ParallaxOptions = {}): ParallaxHandle | null {
  if (!target || typeof window === "undefined") return null;

  const { distance = 120, horizontal = false } = opts;
  const el = target as HTMLElement;
  const prop = horizontal ? "translateX" : "translateY";

  let inView = false;
  let raf = 0;

  const update = () => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // -1 (entering bottom) → 0 (centered) → 1 (leaving top)
    const progress = 1 - (rect.top + rect.height / 2) / (vh + rect.height / 2) * 2;
    const offset = -progress * (distance / 2);
    el.style.transform = `${prop}(${offset.toFixed(2)}px)`;
    if (inView) raf = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(update);
        if (!inView && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      }
    },
    { threshold: 0, rootMargin: "200px 0px 200px 0px" },
  );

  observer.observe(el);

  return {
    revert: () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    },
  };
}
