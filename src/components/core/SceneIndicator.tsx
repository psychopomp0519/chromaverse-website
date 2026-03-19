"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SceneIndicatorProps {
  scenes: { id: string; label: string }[];
  activeScene: number;
  onSceneClick: (index: number) => void;
  className?: string;
}

export function SceneIndicator({
  scenes,
  activeScene,
  onSceneClick,
  className,
}: SceneIndicatorProps) {
  return (
    <nav
      className={cn(
        "fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex",
        className
      )}
      aria-label="씬 네비게이션"
    >
      {scenes.map((scene, i) => {
        const isActive = i === activeScene;
        return (
          <button
            key={scene.id}
            onClick={() => onSceneClick(i)}
            className="group relative flex items-center"
            aria-label={scene.label}
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={cn(
                "absolute right-6 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium",
                "bg-(--color-bg-surface) border border-(--color-border)",
                "opacity-0 transition-opacity group-hover:opacity-100",
                "text-(--color-text-secondary)"
              )}
            >
              {scene.label}
            </span>

            <motion.span
              className={cn(
                "block rounded-full border transition-colors",
                isActive
                  ? "border-(--color-accent-primary) bg-(--color-accent-primary)"
                  : "border-(--color-border-hover) bg-transparent"
              )}
              animate={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={
                isActive
                  ? {
                      boxShadow:
                        "0 0 8px color-mix(in srgb, var(--color-accent-primary) 40%, transparent)",
                    }
                  : undefined
              }
            />

            {i < scenes.length - 1 && (
              <span
                className={cn(
                  "absolute top-full left-1/2 h-3 w-px -translate-x-1/2",
                  i < activeScene
                    ? "bg-(--color-accent-primary)"
                    : "bg-(--color-border)"
                )}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
