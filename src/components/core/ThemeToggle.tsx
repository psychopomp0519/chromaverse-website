"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className, size = 20 }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTheme, setTransitionTheme] = useState<"dark" | "light">("dark");

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const handleToggle = useCallback(() => {
    if (transitioning) return;
    const next = theme === "dark" ? "light" : "dark";
    setTransitionTheme(next as "dark" | "light");
    setTransitioning(true);

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    timersRef.current.push(setTimeout(() => {
      setTheme(next);
    }, 300));

    timersRef.current.push(setTimeout(() => {
      setTransitioning(false);
    }, 700));
  }, [theme, setTheme, transitioning]);

  if (!mounted) {
    return <div className={cn("rounded-lg p-2", className)} style={{ width: size + 16, height: size + 16 }} />;
  }

  const isDark = theme === "dark";

  return (
    <>
      {/* Full-screen transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{
              background: transitionTheme === "dark"
                ? "radial-gradient(circle at center, #0B0B14 0%, transparent 70%)"
                : "radial-gradient(circle at center, #F5F0E8 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        className={cn(
          "relative rounded-lg p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)",
          className
        )}
        aria-label={isDark ? "빛의 모드로 전환" : "어둠의 모드로 전환"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="sun"
              xmlns="http://www.w3.org/2000/svg"
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              xmlns="http://www.w3.org/2000/svg"
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
