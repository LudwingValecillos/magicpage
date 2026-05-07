/**
 * <GradientMesh> — animated nebula backdrop.
 * Pure CSS, GPU-accelerated. Drop behind hero or large sections.
 */

interface GradientMeshProps {
  className?: string;
  variant?: "hero" | "soft";
}

export function GradientMesh({ className = "", variant = "hero" }: GradientMeshProps) {
  if (variant === "soft") {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-[var(--color-violet)] opacity-20 blur-[120px] mesh-shift" />
        <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-[var(--color-pink)] opacity-15 blur-[120px] mesh-shift" style={{ animationDelay: "-6s" }} />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute top-[10%] left-[5%] w-[42rem] h-[42rem] rounded-full bg-[var(--color-violet)] opacity-30 blur-[140px] mesh-shift" />
      <div className="absolute top-[40%] right-[5%] w-[36rem] h-[36rem] rounded-full bg-[var(--color-pink)] opacity-25 blur-[120px] mesh-shift" style={{ animationDelay: "-4s" }} />
      <div className="absolute bottom-[10%] left-[30%] w-[32rem] h-[32rem] rounded-full bg-[var(--color-blue)] opacity-22 blur-[120px] mesh-shift" style={{ animationDelay: "-9s" }} />
    </div>
  );
}
