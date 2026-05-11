/**
 * <Badge> — small pill for product cards.
 * Variants: new (blue), hot (pink), sale (gold), exclusive (violet).
 * Blue is the default brand accent; pink reserved for "hot" / promo moments.
 */

interface BadgeProps {
  variant?: "new" | "hot" | "sale" | "exclusive";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  new: "bg-[var(--color-blue)]/15 text-[var(--color-blue-soft)] border border-[var(--color-blue)]/40 shadow-[0_0_16px_-4px_rgba(77,168,255,0.5)]",
  hot: "bg-[var(--color-pink)]/15 text-[var(--color-pink-soft)] border border-[var(--color-pink)]/45 shadow-[0_0_16px_-4px_rgba(255,95,162,0.5)]",
  sale: "bg-[var(--color-gold)]/15 text-[var(--color-gold)] border border-[var(--color-gold)]/40",
  exclusive: "bg-[var(--color-violet)]/15 text-[var(--color-ivory)] border border-[var(--color-violet)]/45",
};

export function Badge({ variant = "new", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-mono tracking-widest uppercase backdrop-blur-md ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
