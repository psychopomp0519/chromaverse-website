"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

interface ParticleBackgroundProps {
  className?: string;
  density?: number;
  speed?: number;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
  color: string;
}

const COLORS_DARK = ["#FF4D5E", "#34D399", "#60A5FA", "#F4A261", "#9B5DE5"];
const COLORS_LIGHT = ["#1D3557", "#8B2252", "#B8860B", "#457B9D", "#2D6A4F"];

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export function ParticleBackground({
  className,
  density = 50,
  speed = 0.5,
  interactive = false,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const pausedRef = useRef(false);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
      const mobile = isMobile();
      const count = mobile ? Math.floor(density * 0.5) : density;

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: -Math.random() * speed * 0.5 - 0.1,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    },
    [density, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animating = true;
    let logicalW = 0;
    let logicalH = 0;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height;
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(logicalW, logicalH);
    }

    function animate() {
      if (!animating || !canvas || !ctx) return;
      if (pausedRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, logicalW, logicalH);

      const time = frameRef.current * 0.01;
      frameRef.current++;
      const mobile = isMobile();
      const isInteractive = interactive && !mobile;

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = logicalH + 10;
          p.x = Math.random() * logicalW;
        }
        if (p.x < -10) p.x = logicalW + 10;
        if (p.x > logicalW + 10) p.x = -10;

        if (isInteractive) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }

        const flicker = Math.sin(time + p.phase) * 0.15 + 0.85;
        const alpha = p.opacity * flicker;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(animate);
    }

    // Tab visibility pause
    function handleVisibility() {
      pausedRef.current = document.hidden;
    }

    resize();
    if (prefersReducedMotion()) {
      // 정적 한 프레임만 그림
      if (ctx) {
        ctx.clearRect(0, 0, logicalW, logicalH);
        for (const p of particlesRef.current) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    } else {
      animate();
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new MutationObserver(() => {
      const rect = canvas.getBoundingClientRect();
      initParticles(rect.width, rect.height);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      animating = false;
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
    };
  }, [initParticles, interactive]);

  const handleMouseMove = interactive
    ? (e: React.MouseEvent) => {
        if (isMobile()) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    : undefined;

  const handleClick = interactive
    ? (e: React.MouseEvent) => {
        if (isMobile()) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";
        const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
        // Spawn burst particles
        const burst: Particle[] = Array.from({ length: 12 }, () => {
          const angle = Math.random() * Math.PI * 2;
          const v = Math.random() * 3 + 1;
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * v,
            vy: Math.sin(angle) * v,
            size: Math.random() * 3 + 2,
            opacity: 0.6 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        });
        particlesRef.current.push(...burst);
      }
    : undefined;

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", interactive && !isMobile() && "pointer-events-auto", className)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      aria-hidden="true"
      style={{ willChange: "transform" }}
    />
  );
}
