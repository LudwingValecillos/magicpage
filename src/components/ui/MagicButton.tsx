"use client";

/**
 * <MagicButton> — premium CTA. Three variants:
 *   - primary  → pink-to-violet gradient with glow
 *   - ghost    → glass with gradient border
 *   - link     → underline animation
 */

import Link from "next/link";

interface MagicButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "link";
  size?: "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export function MagicButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
}: MagicButtonProps) {
  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const styles = {
    primary: `relative overflow-hidden rounded-full font-semibold text-white
              bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)]
              bg-[length:200%_100%] hover:bg-[position:100%_0%]
              shadow-[0_8px_32px_-8px_rgba(77,168,255,0.7)]
              hover:shadow-[0_16px_48px_-8px_rgba(96,165,250,0.85)]
              transition-all duration-500`,
    ghost: `relative rounded-full font-medium glass text-[var(--color-ivory)]
            hover:bg-white/10 hover:border-[var(--color-blue)]/30 transition-all duration-300`,
    link: `relative inline-flex items-center gap-2 font-medium text-[var(--color-ivory)]
           after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full
           after:bg-gradient-to-r after:from-[var(--color-blue)] after:to-[var(--color-pink)]
           after:scale-x-0 after:origin-left hover:after:scale-x-100
           after:transition-transform after:duration-500`,
  };

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
    </>
  );

  const cls = `inline-flex items-center justify-center ${sizes[size]} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
