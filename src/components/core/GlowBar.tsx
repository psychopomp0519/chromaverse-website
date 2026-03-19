"use client";

import { cn } from "@/lib/utils";

interface GlowBarProps {
  progress: number;
  className?: string;
  height?: number;
}

export function GlowBar({ progress, className, height = 3 }: GlowBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-50", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="읽기 진행률"
    >
      <div
        className="h-full transition-[width] duration-300 ease-out"
        style={{
          width: `${clamped * 100}%`,
          background: `linear-gradient(90deg, var(--color-accent-cool), var(--color-accent-primary), var(--color-accent-warm))`,
          boxShadow:
            "0 0 8px color-mix(in srgb, var(--color-accent-primary) 50%, transparent), 0 0 24px color-mix(in srgb, var(--color-accent-primary) 20%, transparent)",
        }}
      />
    </div>
  );
}
