"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/core/ParticleBackground";

const TITLE_CHARS = "CHROMAVERSE".split("");
const SUBTITLE = "빛과 어둠이 만든 세계";

export function HeroScene() {
  const [typed, setTyped] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setStartTyping(true), 1500);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(SUBTITLE.slice(0, i));
      if (i >= SUBTITLE.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [startTyping]);

  return (
    <section className="snap-scene flex flex-col items-center justify-center px-4">
      <ParticleBackground density={60} speed={0.3} interactive />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-(--color-bg-deep)" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex" aria-label="CHROMAVERSE">
            {TITLE_CHARS.map((char, i) => (
              <motion.span
                key={i}
                className="text-gradient-rgb text-5xl font-black tracking-[0.15em] sm:text-7xl md:text-8xl font-(family-name:--font-heading)"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <p className="h-8 text-lg tracking-[0.2em] text-(--color-text-secondary) sm:text-xl">
            {typed}
            {typed.length < SUBTITLE.length && startTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-(--color-accent-primary)"
              >
                |
              </motion.span>
            )}
          </p>
        </div>

        <motion.p
          className="max-w-lg text-base text-(--color-text-muted)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          프리즈마폴로 태어난 세계 크로마라.
          렌과 묵렌이 빛과 어둠 사이에서 살아가는 이야기.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 text-(--color-text-muted)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 2.5, duration: 0.5 },
          y: { delay: 3, duration: 1.5, repeat: Infinity },
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}
