"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/common/AnimateIn";
import { TiltCard } from "@/components/common/TiltCard";

const SECTIONS = [
  {
    href: "/world",
    title: "세계관",
    subtitle: "크로마라",
    description: "빛의 근원 루미나스에서 태어난 세계. 렌과 묵렌, RGB와 CMYK, 9개 지역의 이야기를 탐험하세요.",
    colors: "from-ador via-vitalis to-cognis",
    icon: "🌍",
  },
  {
    href: "/novel",
    title: "소설",
    subtitle: "크로마버스",
    description: "기록관 카이가 들려주는 700화의 대서사. 빛과 어둠 사이에서 세계를 바꾼 네 사람의 이야기.",
    colors: "from-cognis via-suppress to-shiji",
    icon: "📖",
  },
  {
    href: "/about",
    title: "소개",
    subtitle: "프로젝트",
    description: "크로마버스 세계관의 확장 계획과 프로젝트에 대해 알아보세요.",
    colors: "from-koji via-aochi to-vitalis",
    icon: "✨",
  },
];

const QUOTE_TEXT =
  "이 기록을 시작한 이유는 나중에 쓰겠다.\n지금은 다만, 아무 일도 일어나지 않았던 어느 아침부터 적는다.\n나는 기록관이지, 모험가가 아니다.";

function TypingQuote() {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(QUOTE_TEXT.slice(0, i));
      if (i >= QUOTE_TEXT.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started]);

  const lines = displayed.split("\n");
  const done = displayed.length >= QUOTE_TEXT.length;

  return (
    <blockquote
      ref={ref}
      className="mt-6 text-xl leading-relaxed italic text-(--color-text-secondary) font-(family-name:--font-novel) min-h-[6rem]"
    >
      &ldquo;
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
      {!done && displayed.length > 0 && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="text-(--color-text-muted)"
        >
          |
        </motion.span>
      )}
      {done && "&rdquo;"}
    </blockquote>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [orbOffset, setOrbOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setOrbOffset({ x: nx * 80, y: ny * 80 });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4"
      >
        {/* Mouse-tracking gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute h-[600px] w-[600px] rounded-full bg-ador/10 blur-[120px] transition-transform duration-[1200ms] ease-out"
            style={{
              top: "-15%",
              left: "-15%",
              transform: `translate(${orbOffset.x * 1.2}px, ${orbOffset.y * 0.8}px)`,
            }}
          />
          <div
            className="absolute h-[600px] w-[600px] rounded-full bg-cognis/10 blur-[120px] transition-transform duration-[1500ms] ease-out"
            style={{
              top: "-15%",
              right: "-15%",
              transform: `translate(${orbOffset.x * -0.6}px, ${orbOffset.y * 1.0}px)`,
            }}
          />
          <div
            className="absolute h-[600px] w-[600px] rounded-full bg-vitalis/10 blur-[120px] transition-transform duration-[1800ms] ease-out"
            style={{
              bottom: "-20%",
              left: "50%",
              transform: `translate(calc(-50% + ${orbOffset.x * 0.4}px), ${orbOffset.y * -0.6}px)`,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 flex flex-col items-center gap-8 text-center"
        >
          <div className="flex flex-col gap-2">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-sm font-medium uppercase text-(--color-text-muted)"
            >
              Chromaverse
            </motion.p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl font-(family-name:--font-heading)">
              <span className="text-gradient-rgb">빛</span>이 있었고,{" "}
              <br className="hidden sm:block" />
              <span className="text-(--color-text-secondary)">어둠</span>이 있었고,{" "}
              <br className="hidden sm:block" />
              그 사이에 있던{" "}
              <span className="text-(--color-text-primary)">사람들</span>이 있었다.
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-xl text-lg text-(--color-text-secondary)"
          >
            프리즈마폴로 태어난 세계 크로마라.
            <br />
            렌과 묵렌이 빛과 어둠 사이에서 살아가는 이야기.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex gap-4"
          >
            <Link
              href="/world"
              className="glow-rgb rounded-xl bg-gradient-to-r from-ador/20 via-vitalis/20 to-cognis/20 px-8 py-3 text-sm font-semibold text-(--color-text-primary) transition-all hover:from-ador/30 hover:via-vitalis/30 hover:to-cognis/30"
            >
              세계관 탐험
            </Link>
            <Link
              href="/novel"
              className="rounded-xl border border-white/10 px-8 py-3 text-sm font-semibold text-(--color-text-secondary) transition-all hover:border-white/20 hover:text-(--color-text-primary)"
            >
              소설 읽기
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-(--color-text-muted)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* Section Cards */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {SECTIONS.map((section) => (
            <StaggerItem key={section.href}>
              <TiltCard className="h-full">
                <Link
                  href={section.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-(--color-deep-card) p-8 transition-all hover:border-white/10 hover:shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.colors} opacity-0 transition-opacity group-hover:opacity-5`} />
                  <div className="relative z-10 flex flex-1 flex-col gap-4">
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
                        {section.subtitle}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">{section.title}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-(--color-text-secondary)">
                      {section.description}
                    </p>
                    <span className="mt-auto pt-2 text-sm font-medium text-(--color-text-muted) transition-colors group-hover:text-(--color-text-primary)">
                      더 알아보기 →
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Lore teaser */}
      <section className="border-t border-white/5 py-24">
        <AnimateIn className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-(--color-text-muted)">
            프리즈마력 780년
          </p>
          <TypingQuote />
          <p className="mt-4 text-sm text-(--color-text-muted)">— 카이, 크로마버스 1화</p>
          <Link
            href="/novel"
            className="mt-8 inline-block rounded-lg border border-white/10 px-6 py-2 text-sm text-(--color-text-secondary) transition-all hover:border-white/20 hover:text-(--color-text-primary)"
          >
            1화부터 읽기
          </Link>
        </AnimateIn>
      </section>
    </div>
  );
}
