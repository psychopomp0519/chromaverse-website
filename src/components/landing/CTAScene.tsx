"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { AnimateIn } from "@/components/common/AnimateIn";

const STATS = [
  { value: 700, label: "화의 대서사", suffix: "" },
  { value: 9, label: "개 지역", suffix: "" },
  { value: 4, label: "개 종족", suffix: "" },
  { value: 7, label: "대막", suffix: "" },
];

const TEASERS = [
  { quote: "빛이 없으면 색도 없다.", source: "광명회 교리" },
  { quote: "정확한 것은 버리지 않는다.", source: "카이" },
  { quote: "모든 것은 프리즈마폴에서 시작되었다.", source: "창세 기록" },
  { quote: "괜찮아요.", source: "레이" },
  { quote: "기록관이 더 넓으니까요. 세상을 적고 싶으니까.", source: "카이" },
];

function Counter({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.ceil(value / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [inView, value]);

  return <span>{count}</span>;
}

export function CTAScene() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [teaserIndex, setTeaserIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTeaserIndex((prev) => (prev + 1) % TEASERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="snap-scene flex flex-col items-center justify-center gap-10 px-4">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="text-3xl font-black text-(--color-text-primary) sm:text-4xl">
              <Counter value={stat.value} inView={inView} />
              {stat.suffix}
            </span>
            <p className="mt-1 text-xs text-(--color-text-muted)">{stat.label}</p>
          </div>
        ))}
      </div>

      <AnimateIn className="flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/world"
          className="glow-accent rounded-xl bg-(--color-accent-primary)/10 border border-(--color-accent-primary)/30 px-8 py-3 text-sm font-semibold text-(--color-text-primary) transition-all hover:bg-(--color-accent-primary)/20"
        >
          세계관 탐험하기
        </Link>
        <Link
          href="/novel"
          className="rounded-xl border border-(--color-border-hover) px-8 py-3 text-sm font-semibold text-(--color-text-secondary) transition-all hover:border-(--color-text-primary) hover:text-(--color-text-primary)"
        >
          소설 읽기
        </Link>
      </AnimateIn>

      <motion.div
        className="h-16 text-center"
        key={teaserIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm italic text-(--color-text-secondary) font-(family-name:--font-novel)">
          &ldquo;{TEASERS[teaserIndex].quote}&rdquo;
        </p>
        <p className="mt-1 text-xs text-(--color-text-muted)">
          — {TEASERS[teaserIndex].source}
        </p>
      </motion.div>
    </section>
  );
}
