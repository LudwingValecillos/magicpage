"use client";

/**
 * <MagicButton> — CTA principal. Variantes:
 *   primary  → azul cielo sólido con sombra suave
 *   accent   → rosa
 *   ghost    → borde + fondo blanco
 *   link     → texto con underline animado
 */

import Link from "next/link";

interface MagicButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function MagicButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  type = "button",
  disabled = false,
}: MagicButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-7 py-4 text-base",
  };

  const styles = {
    primary:
      "bg-[var(--color-sky)] text-white shadow-[var(--shadow-sky)] hover:bg-[var(--color-sky-deep)] hover:-translate-y-0.5",
    accent:
      "bg-[var(--color-pink)] text-white shadow-[var(--shadow-pink)] hover:bg-[var(--color-pink-deep)] hover:-translate-y-0.5",
    ghost:
      "bg-white text-[var(--color-ink)] border border-[var(--color-rule-strong)] hover:border-[var(--color-sky)] hover:text-[var(--color-sky-deep)]",
    link:
      "text-[var(--color-sky-deep)] underline-offset-4 hover:underline px-0 py-0",
  };

  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ${
    variant === "link" ? "" : sizes[size]
  } ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  const inner = (
    <>
      {children}
      {icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
