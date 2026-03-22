"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/core/ThemeToggle";
import { AuthButton } from "@/components/auth/AuthButton";

export function CinemaHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);
        setVisible(y < 20 || y < lastScrollY.current);
        lastScrollY.current = y;
        ticking = false;
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "bg-glass" : "bg-transparent"
      )}
      animate={{ y: visible ? 0 : -64 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gradient-rgb text-lg font-bold tracking-wider font-(family-name:--font-heading)">
            CHROMAVERSE
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
