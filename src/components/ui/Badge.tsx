/**
 * <Badge> — small pill for product cards. Variants: new, hot, sale, exclusive.
 */

interface BadgeProps {
  variant?: "new" | "hot" | "sale" | "exclusive";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  new: "bg-[var(--color-blue)]/20 text-[var(--color-blue-soft)] border border-[var(--color-blue)]/40",
  hot: "bg-[var(--color-pink)]/20 text-[var(--color-pink-soft)] border border-[var(--color-pink)]/50",
  sale: "bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/40",
  exclusive: "bg-[var(--color-violet)]/20 text-[var(--color-ivory)] border border-[var(--color-violet)]/50",
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
