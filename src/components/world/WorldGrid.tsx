"use client";

import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/common/AnimateIn";
import { TiltCard } from "@/components/common/TiltCard";

interface WorldSection {
  href: string;
  title: string;
  kanji: string;
  description: string;
  color: string;
  accent: string;
}

export function WorldGrid({ sections }: { sections: WorldSection[] }) {
  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sections.map((section) => (
        <StaggerItem key={section.href}>
          <TiltCard className="h-full" tiltDeg={6} glareOpacity={0.08}>
            <Link
              href={section.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-(--color-deep-card) p-6 transition-all hover:border-white/10 hover:shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative z-10">
                <p className="text-xs font-medium tracking-wider text-(--color-text-muted)">
                  {section.kanji}
                </p>
                <h2 className="mt-1 text-xl font-bold">{section.title}</h2>
                <p className="mt-2 text-sm text-(--color-text-secondary) leading-relaxed">
                  {section.description}
                </p>
                <span className="mt-4 inline-block text-xs font-medium text-(--color-text-muted) transition-colors group-hover:text-(--color-text-primary)">
                  탐험하기 &rarr;
                </span>
              </div>
            </Link>
          </TiltCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
