/**
 * <Badge> — pill chico para cards.
 * Variantes: oferta (coral), nuevo (sky), disney (sky), marvel (pink).
 */

interface BadgeProps {
  variant?: "oferta" | "nuevo" | "disney" | "marvel";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  oferta: "bg-[var(--color-coral)] text-white",
  nuevo: "bg-[var(--color-yellow)] text-[var(--color-ink)]",
  disney: "bg-[var(--color-sky)] text-white",
  marvel: "bg-[var(--color-pink)] text-white",
};

export function Badge({ variant = "nuevo", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
