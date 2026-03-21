"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const WORLD_TEASERS = [
  "빛이 있었고, 어둠이 있었고, 그 사이에 있던 사람들이 있었다.",
  "프리즈마폴 이전, 루미나스는 혼자였다. 그 외로움이 세계를 만들었다.",
  "아도르의 열기는 파괴만이 아니다. 모든 재탄생은 불꽃에서 시작된다.",
  "쿠로겐은 악이 아니다. 빛이 닿기 전, 세상은 이미 어둠이었다.",
  "채도가 높을수록 강하다고? 천만에. 채도 15의 카이가 세계를 바꿨다.",
  "코그니스 255에 도달한 자는 역사상 셋뿐이다. 그중 하나는 미쳤다.",
  "크로마스톰이 다가온다. 하늘의 색이 비명을 지르기 시작할 때, 도망쳐라.",
  "보이드는 빛의 부재가 아니다. 빛 이전부터 있던 것이다.",
  "하쿠텐의 백색은 평화가 아니라 모든 색의 억압이다.",
  "더 딥에서 돌아온 자는 없다. 공식적으로는.",
];

export function Footer() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * WORLD_TEASERS.length));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORLD_TEASERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="border-t border-(--color-border) py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Accent glow divider */}
          <div className="relative h-[10px] w-64 overflow-hidden">
            {mounted && (
              <Image
                src={theme === "light" ? "/images/ui/divider-light.webp" : "/images/ui/divider-dark.webp"}
                alt=""
                fill
                className="object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>

          {/* World Teaser */}
          <motion.div
            className="min-h-[3rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              key={index}
              className="max-w-lg text-sm italic text-(--color-text-secondary) leading-relaxed font-(family-name:--font-novel)"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
            >
              {WORLD_TEASERS[index]}
            </motion.p>
          </motion.div>

          <span className="text-gradient-rgb text-lg font-bold">CHROMAVERSE</span>
          <p className="text-xs text-(--color-text-muted)">
            &copy; {new Date().getFullYear()} Chromaverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
