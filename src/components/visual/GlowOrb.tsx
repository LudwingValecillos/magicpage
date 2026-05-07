/**
 * <GlowOrb> — colored blurred sphere. Use as ambient lighting.
 */

interface GlowOrbProps {
  className?: string;
  color?: "pink" | "blue" | "violet" | "gold";
  size?: number;
  blur?: number;
  opacity?: number;
}

const colorMap = {
  pink: "var(--color-pink)",
  blue: "var(--color-blue)",
  violet: "var(--color-violet)",
  gold: "var(--color-gold)",
};

export function GlowOrb({
  className = "",
  color = "violet",
  size = 320,
  blur = 100,
  opacity = 0.5,
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none rounded-full pulse-glow ${className}`}
      style={{
        width: size,
        height: size,
        background: colorMap[color],
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
