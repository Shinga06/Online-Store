import { useState } from "react";

type Props = {
  name: string;
  category: string;
  className?: string;
  src?: string;
};

// Deterministic gradient + initials placeholder image for products.
// Industrial palette: navy → steel grey, with a hi-vis accent stripe.
export function ProductImage({ name, category, className, src }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  // Pick a subtle hue rotation from category to differentiate cards
  const hash = [...category].reduce((a, c) => a + c.charCodeAt(0), 0);
  const angle = (hash % 30) + 135;

  const [hasError, setHasError] = useState(false);

  // If a real image src is provided and it hasn't errored out, render it
  if (src && src.trim() && !hasError) {
    return (
      <div className={`relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden ${className ?? ""}`}>
        <img
          src={src.trim()}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className ?? ""}`}
      style={{
        background: `linear-gradient(${angle}deg, oklch(0.22 0.05 255) 0%, oklch(0.35 0.03 250) 60%, oklch(0.55 0.02 250) 100%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0 2px, transparent 2px 14px)",
        }}
      />
      <div className="absolute top-0 left-0 h-1.5 w-full" style={{ background: "var(--hi-vis)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/90 font-display font-bold tracking-tight text-5xl md:text-6xl">
          {initials}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/70 font-medium">
        <span>PPE / Workwear</span>
        <span>{category.replace(/-/g, " ")}</span>
      </div>
    </div>
  );
}
