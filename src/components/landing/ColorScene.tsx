"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimateIn } from "@/components/common/AnimateIn";

const CHANNELS = [
  { name: "아도르", color: "#E63946", desc: "열정, 파괴, 생명력" },
  { name: "비탈리스", color: "#2D6A4F", desc: "성장, 치유, 순환" },
  { name: "코그니스", color: "#457B9D", desc: "지식, 침착, 관찰" },
  { name: "서프레스", color: "#1D3557", desc: "억제, 봉인" },
  { name: "이로드", color: "#6B2737", desc: "침식, 변형" },
  { name: "디스토트", color: "#B5838D", desc: "왜곡, 환상" },
  { name: "보이드", color: "#0B0B0B", desc: "소멸, 공허" },
];

export function ColorScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const runningRef = useRef(true);
  const [activeChannel, setActiveChannel] = useState<number | null>(null);

  const draw = useCallback(() => {
    if (!runningRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const mx = mouseRef.current.x * w;
    const my = mouseRef.current.y * h;

    // Draw each channel as a radial gradient orb influenced by mouse
    CHANNELS.forEach((ch, i) => {
      const angle = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(w, h) * 0.28;
      const baseX = w / 2 + Math.cos(angle) * radius;
      const baseY = h / 2 + Math.sin(angle) * radius;

      // Mouse influence: orbs drift toward cursor
      const dx = mx - baseX;
      const dy = my - baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / (Math.min(w, h) * 0.5));
      const orbX = baseX + dx * influence * 0.3;
      const orbY = baseY + dy * influence * 0.3;
      const orbRadius = Math.min(w, h) * (0.12 + influence * 0.05);

      const gradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      gradient.addColorStop(0, ch.color + "60");
      gradient.addColorStop(0.6, ch.color + "20");
      gradient.addColorStop(1, ch.color + "00");

      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    // Center mixing glow
    const centerGrad = ctx.createRadialGradient(mx, my, 0, mx, my, Math.min(w, h) * 0.15);
    centerGrad.addColorStop(0, "rgba(255,255,255,0.08)");
    centerGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(mx, my, Math.min(w, h) * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();

    requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    runningRef.current = true;
    resize();
    const frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  return (
    <section className="snap-scene flex flex-col items-center justify-center gap-8 px-4">
      <AnimateIn className="text-center">
        <h2 className="text-2xl font-bold text-(--color-text-primary) sm:text-3xl">
          7개의 채널이 세계를 물들인다
        </h2>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          RGB는 빛의 힘, CMYK는 어둠의 힘
        </p>
      </AnimateIn>

      {/* Interactive Canvas */}
      <div className="relative w-full max-w-2xl" style={{ aspectRatio: "1" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full rounded-2xl cursor-crosshair"
          onMouseMove={handleMouseMove}
        />
        {/* Channel labels overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {CHANNELS.map((ch, i) => {
            const angle = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 38;
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return (
              <motion.div
                key={ch.name}
                className="absolute text-center pointer-events-auto cursor-default"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveChannel(i)}
                onMouseLeave={() => setActiveChannel(null)}
              >
                <div
                  className="mx-auto h-6 w-6 rounded-full border-2 border-(--color-bg-surface) transition-transform"
                  style={{
                    background: ch.color,
                    transform: activeChannel === i ? "scale(1.4)" : "scale(1)",
                    boxShadow: activeChannel === i ? `0 0 16px ${ch.color}80` : "none",
                  }}
                />
                <p className="mt-1 text-[10px] font-bold text-(--color-text-primary)">{ch.name}</p>
                {activeChannel === i && (
                  <motion.p
                    className="text-[9px] text-(--color-text-muted)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {ch.desc}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
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
