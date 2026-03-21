"use client";

import Image from "next/image";

interface WorldHeroProps {
  section: string;
  alt: string;
}

const HERO_MAP: Record<string, string> = {
  creation: "/images/world/creation.webp",
  races: "/images/world/races.webp",
  power: "/images/world/power.webp",
  society: "/images/world/society.webp",
  religion: "/images/world/religion.webp",
  geography: "/images/world/geography.webp",
  history: "/images/world/history.webp",
  glossary: "/images/world/glossary.webp",
  economy: "/images/world/economy.webp",
  growth: "/images/world/growth.webp",
  chromastorm: "/images/world/chromastorm.webp",
  "special-beings": "/images/world/special-beings.webp",
};

export function WorldHero({ section, alt }: WorldHeroProps) {
  const src = HERO_MAP[section];
  if (!src) return null;

  return (
    <div className="relative mb-10 h-48 w-full overflow-hidden rounded-2xl sm:h-64">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1024px"
        priority
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-(--color-bg-deep) via-transparent to-transparent" />
    </div>
  );
}
