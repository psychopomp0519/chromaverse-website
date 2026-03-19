"use client";

import { useRef, useState, useEffect } from "react";
import { HeroScene } from "@/components/landing/HeroScene";
import { GenesisScene } from "@/components/landing/GenesisScene";
import { NovelScene } from "@/components/landing/NovelScene";
import { ColorScene } from "@/components/landing/ColorScene";
import { CTAScene } from "@/components/landing/CTAScene";
import { SceneIndicator } from "@/components/core/SceneIndicator";

const SCENES = [
  { id: "hero", label: "히어로" },
  { id: "genesis", label: "창세신화" },
  { id: "novel", label: "소설" },
  { id: "color", label: "색채 체계" },
  { id: "cta", label: "시작하기" },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observers: IntersectionObserver[] = [];

    sceneRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveScene(i);
        },
        { root: container, threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollToScene(index: number) {
    sceneRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div
        ref={containerRef}
        className="snap-container -mt-16"
        style={{ height: "100vh" }}
      >
        <div ref={(el) => { sceneRefs.current[0] = el; }}>
          <HeroScene />
        </div>
        <div ref={(el) => { sceneRefs.current[1] = el; }}>
          <GenesisScene />
        </div>
        <div ref={(el) => { sceneRefs.current[2] = el; }}>
          <NovelScene />
        </div>
        <div ref={(el) => { sceneRefs.current[3] = el; }}>
          <ColorScene />
        </div>
        <div ref={(el) => { sceneRefs.current[4] = el; }}>
          <CTAScene />
        </div>
      </div>

      <SceneIndicator
        scenes={SCENES}
        activeScene={activeScene}
        onSceneClick={scrollToScene}
      />
    </>
  );
}
