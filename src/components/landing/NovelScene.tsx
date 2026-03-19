"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const QUOTE_TEXT =
  "이 기록을 시작한 이유는 나중에 쓰겠다.\n지금은 다만, 아무 일도 일어나지 않았던 어느 아침부터 적는다.\n나는 기록관이지, 모험가가 아니다.";

export function NovelScene() {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

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
    <section ref={ref} className="snap-scene flex flex-col items-center justify-center gap-8 px-4">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.p
          className="text-xs font-medium tracking-[0.3em] uppercase text-(--color-text-muted)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          프리즈마력 780년 — 카이의 기록
        </motion.p>

        <blockquote className="mt-6 min-h-[7rem] text-xl leading-relaxed italic text-(--color-text-secondary) font-(family-name:--font-novel) sm:text-2xl">
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

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            href="/novel/1"
            className="inline-block rounded-xl border border-(--color-border-hover) px-8 py-3 text-sm font-semibold text-(--color-text-primary) transition-all hover:border-(--color-accent-primary) hover:glow-accent"
          >
            이야기 시작하기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
