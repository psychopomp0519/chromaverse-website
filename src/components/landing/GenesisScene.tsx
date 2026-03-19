"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "@/components/common/AnimateIn";

export function GenesisScene() {
  return (
    <section className="snap-scene flex items-center justify-center px-4">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-16">
        <AnimateIn className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
          <motion.div
            className="h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: "radial-gradient(circle, var(--color-ador-light) 0%, var(--color-vitalis) 50%, transparent 70%)",
              filter: "blur(1px)",
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <h2 className="text-2xl font-bold text-(--color-text-primary) sm:text-3xl">
            빛의 근원, <span className="text-ador">루미나스</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-(--color-text-secondary)">
            모든 색의 시작. 루미나스의 빛이 흩어져 세계에 색을 부여했다.
            렌의 이로몬은 그 빛의 파편이며, 크로마 값은 빛의 잔향이다.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.2} className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <motion.div
            className="h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: "radial-gradient(circle, var(--color-suppress) 0%, var(--color-void) 50%, transparent 70%)",
              filter: "blur(1px)",
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
          <h2 className="text-2xl font-bold text-(--color-text-primary) sm:text-3xl">
            어둠의 근원, <span className="text-suppress">쿠로겐</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-(--color-text-secondary)">
            빛이 닿지 않는 곳에서 태어난 힘. 쿠로겐의 어둠은 빛을 삼키는 것이 아니라
            빛과 다른 방식으로 세계를 채운다.
          </p>
        </AnimateIn>
      </div>

      <AnimateIn delay={0.4} className="absolute bottom-12 text-center">
        <p className="text-xs tracking-widest text-(--color-text-muted)">
          그리고 빛과 어둠이 만나는 곳에서 — 프리즈마폴이 태어났다
        </p>
      </AnimateIn>
    </section>
  );
}
