"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReadChapters } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";
import type { ChapterSummary } from "@/lib/content";

const ARC_COLORS = [
  { active: "border-cognis/40 bg-cognis/10 text-cognis", tab: "bg-cognis/15 text-cognis border-cognis/30" },
  { active: "border-ador/40 bg-ador/10 text-ador", tab: "bg-ador/15 text-ador border-ador/30" },
  { active: "border-shiji/40 bg-shiji/10 text-shiji", tab: "bg-shiji/15 text-shiji border-shiji/30" },
  { active: "border-enji/40 bg-enji/10 text-enji", tab: "bg-enji/15 text-enji border-enji/30" },
  { active: "border-suppress/40 bg-suppress/10 text-suppress-light", tab: "bg-suppress/15 text-suppress-light border-suppress/30" },
  { active: "border-hakuten/40 bg-hakuten/10 text-hakuten", tab: "bg-hakuten/15 text-hakuten border-hakuten/30" },
  { active: "border-vitalis/40 bg-vitalis/10 text-vitalis", tab: "bg-vitalis/15 text-vitalis border-vitalis/30" },
];

interface Arc {
  id: number;
  title: string;
  chapters: string;
  keywords: string;
  synopsis: string;
  volumes: { id: number; title: string; chapters: number[] }[];
}

interface NovelTOCProps {
  arcs: Arc[];
  chapterSummaries: ChapterSummary[];
}

export function NovelTOC({ arcs, chapterSummaries }: NovelTOCProps) {
  const [activeArc, setActiveArc] = useState(1);
  const [readChapters, setReadChapters] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const chapters = await getReadChapters();
      setReadChapters(chapters);
    }
    load();
  }, []);

  const summaryMap = new Map(chapterSummaries.map((s) => [s.chapter, s]));
  const currentArc = arcs.find((a) => a.id === activeArc)!;
  const colorSet = ARC_COLORS[(activeArc - 1) % ARC_COLORS.length];

  // 해당 대막에 연재된 화가 있는지
  const hasAvailableChapters = (arc: Arc) =>
    arc.volumes.some((v) =>
      Array.from(
        { length: v.chapters[1] - v.chapters[0] + 1 },
        (_, i) => v.chapters[0] + i
      ).some((ch) => summaryMap.has(ch))
    );

  return (
    <div>
      {/* 대막 탭 바 */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {arcs.map((arc, i) => {
          const isActive = arc.id === activeArc;
          const hasChapters = hasAvailableChapters(arc);
          const colors = ARC_COLORS[i % ARC_COLORS.length];

          return (
            <button
              key={arc.id}
              onClick={() => setActiveArc(arc.id)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? colors.tab
                  : hasChapters
                  ? "border-(--color-border) bg-(--color-bg-surface) text-(--color-text-secondary) hover:border-(--color-border-hover)"
                  : "border-(--color-border) bg-transparent text-(--color-text-muted)/40 cursor-default"
              }`}
              disabled={!hasChapters && !isActive}
            >
              <span className="hidden sm:inline">대막{arc.id}</span>
              <span className="sm:hidden">{arc.id}</span>
            </button>
          );
        })}
      </div>

      {/* 대막 소개 */}
      <div className={`mb-6 rounded-xl border p-5 ${colorSet.active}`}>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-sm font-bold opacity-60">대막 {currentArc.id}</span>
          <h3 className="text-lg font-bold text-(--color-text-primary)">{currentArc.title}</h3>
          <span className="ml-auto text-xs opacity-60">{currentArc.chapters}</span>
        </div>
        <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-3">
          {currentArc.synopsis}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {currentArc.keywords.split(", ").map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-xs text-(--color-text-muted)"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 권/화 리스트 */}
      <div className="space-y-6">
        {currentArc.volumes.map((volume) => {
          const chapterNums = Array.from(
            { length: volume.chapters[1] - volume.chapters[0] + 1 },
            (_, i) => volume.chapters[0] + i
          );
          const availableInVolume = chapterNums.filter((ch) => summaryMap.has(ch));
          const hasAny = availableInVolume.length > 0;

          return (
            <div key={volume.id}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-(--color-text-primary)">
                  {volume.id}권
                </span>
                <span className="text-sm text-(--color-text-secondary)">
                  {volume.title}
                </span>
                {!hasAny && (
                  <span className="ml-auto rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-[10px] text-(--color-text-muted)">
                    미연재
                  </span>
                )}
              </div>

              {hasAny ? (
                <div className="space-y-1">
                  {chapterNums.map((ch) => {
                    const summary = summaryMap.get(ch);
                    if (!summary) return null;
                    const isRead = readChapters.includes(ch);

                    return (
                      <Link
                        key={ch}
                        href={`/novel/${ch}`}
                        className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                          isRead
                            ? "border-[var(--color-vitalis)]/20 bg-[var(--color-vitalis)]/5 hover:border-[var(--color-vitalis)]/30"
                            : "border-(--color-border) bg-(--color-bg-surface) hover:border-(--color-border-hover) hover:bg-(--color-bg-elevated)"
                        }`}
                      >
                        {/* 읽음 표시 */}
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                          isRead
                            ? "bg-[var(--color-vitalis)]/20 text-[var(--color-vitalis)]"
                            : "bg-(--color-bg-elevated) text-(--color-text-muted)"
                        }`}>
                          {isRead ? "✓" : ch}
                        </span>

                        {/* 화 번호 + 제목 */}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-(--color-text-primary) group-hover:text-(--color-accent-primary) transition-colors">
                            {ch}화
                          </span>
                          <span className="mx-2 text-(--color-text-muted)">·</span>
                          <span className="text-sm text-(--color-text-secondary)">
                            {summary.title}
                          </span>
                        </div>

                        {/* 글자수 */}
                        <span className="shrink-0 text-xs text-(--color-text-muted)/60">
                          {Math.round(summary.wordCount / 1000)}k자
                        </span>

                        {/* 화살표 */}
                        <span className="shrink-0 text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-(--color-border) px-4 py-6 text-center text-xs text-(--color-text-muted)/40">
                  연재 예정
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
