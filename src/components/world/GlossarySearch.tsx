"use client";

import { useState, useMemo } from "react";
import { GlossaryCard } from "./GlossaryCard";
import type { GlossaryCategory, GlossaryEntry } from "@/types/world";

const CATEGORIES: { key: GlossaryCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "신화", label: "신화" },
  { key: "종족", label: "종족" },
  { key: "신체", label: "신체" },
  { key: "생물", label: "생물" },
  { key: "사회", label: "사회" },
  { key: "종교", label: "종교" },
  { key: "성장", label: "성장" },
  { key: "경제", label: "경제" },
  { key: "지리", label: "지리" },
  { key: "전투", label: "전투" },
];

interface GlossarySearchProps {
  entries: GlossaryEntry[];
}

export function GlossarySearch({ entries }: GlossarySearchProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !search ||
        entry.term.includes(search) ||
        entry.kanji.includes(search) ||
        entry.shortDesc.includes(search);
      const matchesCategory =
        activeCategory === "all" || entry.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, entries]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="용어 검색..."
          className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-elevated) px-4 py-3 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:border-cognis/30 focus:outline-none"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-full px-3.5 py-2 text-sm sm:px-3 sm:py-1.5 sm:text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? "bg-cognis/20 text-cognis-light"
                : "bg-(--color-bg-surface) text-(--color-text-muted) hover:text-(--color-text-secondary)"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-(--color-text-muted)">{filtered.length}개 용어</p>

      <div className="space-y-3">
        {filtered.map((entry) => (
          <GlossaryCard key={entry.id} entry={entry} allEntries={entries} />
        ))}
      </div>
    </>
  );
}
