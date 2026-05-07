"use client";

/**
 * <FloatingItem> — wraps content in a float + scroll-parallax shell.
 * Use for hero product badges, stickers, mascots.
 */

import { useEffect, useRef } from "react";
import { parallaxOnScroll } from "@/lib/anime/scroll";

interface FloatingItemProps {
  children: React.ReactNode;
  className?: string;
  parallax?: number;
  delay?: string;
  speed?: "fast" | "slow";
}

export function FloatingItem({
  children,
  className = "",
  parallax = 80,
  delay = "0s",
  speed = "slow",
}: FloatingItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = parallaxOnScroll(ref.current, { distance: parallax });
    return () => {
      anim?.revert();
    };
  }, [parallax]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ animationDelay: delay }}>
      <div className={speed === "fast" ? "float" : "float-slow"} style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}
