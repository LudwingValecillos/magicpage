"use client";

/**
 * <ParallaxText> — drives a transform from the scroll position via
 * parallaxOnScroll(). Use for editorial accents (numbers, labels, marks).
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { parallaxOnScroll, type ParallaxOptions } from "@/lib/anime/scroll";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ParallaxTextProps extends ParallaxOptions {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxText({ children, className, ...opts }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const anim = parallaxOnScroll(ref.current, opts);
    return () => {
      anim?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
