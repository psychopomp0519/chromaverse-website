"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const MENU_ITEMS = [
  {
    href: "/world",
    label: "세계관",
    angle: 225,
    colorVar: "--color-cognis",
  },
  {
    href: "/novel",
    label: "소설",
    angle: 270,
    colorVar: "--color-ador",
  },
  {
    href: "/about",
    label: "소개",
    angle: 315,
    colorVar: "--color-vitalis",
  },
];

const RADIUS = 90;

export function RadialMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className={cn("fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8", className)}
    >
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "var(--color-bg-overlay)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {MENU_ITEMS.map((item, i) => {
              const rad = (item.angle * Math.PI) / 180;
              const x = Math.cos(rad) * RADIUS;
              const y = Math.sin(rad) * RADIUS;
              const isActive = pathname.startsWith(item.href);

              return (
                <motion.div
                  key={item.href}
                  className="absolute z-50"
                  style={{ bottom: 24, right: 24 }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  animate={{ x, y: y, opacity: 1, scale: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: i * 0.05,
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      "bg-(--color-bg-surface) border border-(--color-border)",
                      "hover:border-(--color-border-hover) hover:scale-105",
                      isActive && "border-(--color-border-active)"
                    )}
                    style={{
                      boxShadow: isActive
                        ? `0 0 12px color-mix(in srgb, var(${item.colorVar}) 30%, transparent)`
                        : undefined,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: `var(${item.colorVar})` }}
                    />
                    <span className="text-(--color-text-primary)">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
            <motion.div
              className="absolute z-50"
              style={{ bottom: 24, right: 24 }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
              animate={{
                x: Math.cos((180 * Math.PI) / 180) * RADIUS,
                y: Math.sin((180 * Math.PI) / 180) * RADIUS,
                opacity: 1,
                scale: 1,
              }}
              exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: 0.15,
              }}
            >
              <ThemeToggle className="rounded-full bg-(--color-bg-surface) border border-(--color-border)" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-(--color-bg-surface) border border-(--color-border)",
          "text-(--color-text-primary) shadow-lg",
          "transition-colors hover:border-(--color-border-hover)",
          open && "border-(--color-border-active)"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        aria-label="메인 메뉴"
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>
    </div>
  );
}
