"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useReaderStore } from "@/stores/reader";
import { buildGlossaryContext, highlightGlossaryTerms } from "@/components/novel/GlossaryPopup";
import { Comments } from "@/components/novel/Comments";
import { upsertReadingProgress } from "@/lib/reading";
import type { ChapterData } from "@/lib/content";

interface ReaderContentProps {
  chapter: ChapterData;
  chapterNum: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ReaderContent({ chapter, chapterNum, hasPrev, hasNext }: ReaderContentProps) {
  const { fontSize, increaseFontSize, decreaseFontSize, readerTheme, setReaderTheme } = useReaderStore();

  // 읽기 기록 저장
  useEffect(() => {
    upsertReadingProgress(chapterNum);
  }, [chapterNum]);

  const themeStyles = {
    dark: { bg: "bg-(--color-deep)", text: "text-(--color-text-secondary)" },
    light: { bg: "bg-white", text: "text-gray-800" },
    sepia: { bg: "bg-amber-50", text: "text-amber-950" },
  }[readerTheme];

  const themeLabels = { dark: "다크", light: "라이트", sepia: "세피아" } as const;
  const nextTheme = { dark: "light", light: "sepia", sepia: "dark" } as const;

  const glossaryCtx = useMemo(
    () => buildGlossaryContext(chapter.glossaryTerms),
    [chapter.glossaryTerms]
  );

  const paragraphs = chapter.content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* Reader Controls */}
      <div className="mb-8 flex items-center gap-1 sm:gap-2 rounded-xl bg-(--color-deep-card) p-2">
        <button
          onClick={decreaseFontSize}
          className="rounded-lg px-3 py-2.5 sm:py-1.5 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) hover:bg-white/5 active:bg-white/10"
        >
          가-
        </button>
        <button
          onClick={increaseFontSize}
          className="rounded-lg px-3 py-2.5 sm:py-1.5 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) hover:bg-white/5 active:bg-white/10"
        >
          가+
        </button>
        <span className="text-xs text-(--color-text-muted)">{fontSize}px</span>
        <button
          onClick={() => setReaderTheme(nextTheme[readerTheme])}
          className="rounded-lg px-3 py-2.5 sm:py-1.5 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) hover:bg-white/5 active:bg-white/10"
        >
          {themeLabels[readerTheme]}
        </button>
        <div className="flex-1" />
        <Link
          href="/novel"
          className="rounded-lg px-3 py-2.5 sm:py-1.5 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) hover:bg-white/5 active:bg-white/10"
        >
          목차
        </Link>
      </div>

      {/* Chapter Header */}
      <header className="mb-12 text-center">
        <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
          대막 {chapter.arc} · {chapter.volume}권
        </p>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          {chapter.chapter}화
        </p>
        <h1 className="mt-1 text-2xl font-bold font-(family-name:--font-novel)">
          {chapter.title}
        </h1>
      </header>

      {/* Content */}
      <article
        className={`mb-16 rounded-2xl p-6 sm:p-8 leading-loose font-(family-name:--font-novel) transition-colors ${themeStyles.bg} ${themeStyles.text}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-6 text-justify indent-8">
            {highlightGlossaryTerms(p, glossaryCtx)}
          </p>
        ))}
      </article>

      {/* Chapter Navigation */}
      <nav className="flex items-center justify-between border-t border-white/5 pt-8">
        {hasPrev ? (
          <Link
            href={`/novel/${chapterNum - 1}`}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-(--color-text-secondary) transition-all hover:border-white/20 hover:text-(--color-text-primary)"
          >
            &larr; {chapterNum - 1}화
          </Link>
        ) : (
          <div />
        )}
        {hasNext ? (
          <Link
            href={`/novel/${chapterNum + 1}`}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-(--color-text-secondary) transition-all hover:border-white/20 hover:text-(--color-text-primary)"
          >
            {chapterNum + 1}화 &rarr;
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {/* 댓글 */}
      <Comments chapter={chapterNum} />
    </>
  );
}
