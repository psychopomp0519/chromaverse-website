"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimateIn } from "@/components/common/AnimateIn";

const CHANNELS = [
  { name: "아도르", color: "var(--color-ador)", desc: "빨강 — 열정, 파괴, 생명력" },
  { name: "비탈리스", color: "var(--color-vitalis)", desc: "초록 — 성장, 치유, 순환" },
  { name: "코그니스", color: "var(--color-cognis)", desc: "파랑 — 지식, 침착, 관찰" },
  { name: "서프레스", color: "var(--color-suppress)", desc: "잉크블루 — 억제, 봉인" },
  { name: "이로드", color: "var(--color-erode)", desc: "잉크마젠타 — 침식, 변형" },
  { name: "디스토트", color: "var(--color-distort)", desc: "잉크옐로우 — 왜곡, 환상" },
  { name: "보이드", color: "var(--color-void)", desc: "검정 — 소멸, 공허" },
];

export function ColorScene() {
  return (
    <section className="snap-scene flex flex-col items-center justify-center gap-10 px-4">
      <AnimateIn className="text-center">
        <h2 className="text-2xl font-bold text-(--color-text-primary) sm:text-3xl">
          7개의 채널이 세계를 물들인다
        </h2>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          RGB는 빛의 힘, CMYK는 어둠의 힘
        </p>
      </AnimateIn>

      <div className="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {CHANNELS.map((ch, i) => (
          <motion.div
            key={ch.name}
            className="group flex flex-col items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-3 transition-all hover:border-(--color-border-hover)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="h-10 w-10 rounded-full transition-shadow group-hover:shadow-lg"
              style={{
                background: ch.color,
                boxShadow: `0 0 0 transparent`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.boxShadow = `0 0 16px ${ch.color}60`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.boxShadow = `0 0 0 transparent`;
              }}
            />
            <span className="text-xs font-semibold text-(--color-text-primary)">
              {ch.name}
            </span>
            <span className="text-center text-[10px] leading-tight text-(--color-text-muted)">
              {ch.desc}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimateIn delay={0.4}>
        <Link
          href="/world"
          className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
        >
          세계관 더 알아보기 →
        </Link>
      </AnimateIn>
    </section>
  );
}
