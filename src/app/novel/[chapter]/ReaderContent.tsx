"use client";

import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReaderStore } from "@/stores/reader";
import { buildGlossaryContext, highlightGlossaryTerms } from "@/components/novel/GlossaryPopup";
import { Comments } from "@/components/novel/Comments";
import { upsertReadingProgress } from "@/lib/reading";
import { GlowBar } from "@/components/core/GlowBar";
import type { ChapterData } from "@/lib/content";

interface ReaderContentProps {
  chapter: ChapterData;
  chapterNum: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ReaderContent({ chapter, chapterNum, hasPrev, hasNext }: ReaderContentProps) {
  const { fontSize, increaseFontSize, decreaseFontSize, readerTheme, setReaderTheme } = useReaderStore();
  const [progress, setProgress] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);

  // 읽기 기록 저장
  useEffect(() => {
    upsertReadingProgress(chapterNum);
  }, [chapterNum]);

  // 스크롤 진행률 + UI 숨김
  useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? y / h : 0;
        setProgress(p);

        // UI visibility: show on scroll up or near top
        if (y < 100 || y < lastScrollY.current) {
          setUiVisible(true);
          if (hideTimer.current) clearTimeout(hideTimer.current);
          hideTimer.current = setTimeout(() => {
            if (window.scrollY > 100) setUiVisible(false);
          }, 3000);
        } else {
          setUiVisible(false);
        }
        lastScrollY.current = y;
        ticking = false;
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const themeStyles = {
    dark: { bg: "bg-(--color-bg-deep)", text: "text-(--color-text-secondary)" },
    light: { bg: "bg-white", text: "text-gray-800" },
    sepia: { bg: "bg-amber-50", text: "text-amber-950" },
  }[readerTheme];

  const nextTheme = { dark: "light", light: "sepia", sepia: "dark" } as const;
  const themeLabels = { dark: "다크", light: "라이트", sepia: "세피아" } as const;

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
      {/* Glow Progress Bar */}
      <GlowBar progress={progress} />

      {/* Floating Controls (우하단) */}
      <div className="fixed bottom-20 right-6 z-40 md:right-8">
        <AnimatePresence>
          {controlsOpen && (
            <motion.div
              className="mb-2 flex flex-col gap-1 rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-2 shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={decreaseFontSize}
                className="rounded-lg px-3 py-1.5 text-sm text-(--color-text-muted) hover:bg-(--color-bg-elevated) hover:text-(--color-text-primary)"
              >
                가-
              </button>
              <span className="text-center text-xs text-(--color-text-muted)">{fontSize}px</span>
              <button
                onClick={increaseFontSize}
                className="rounded-lg px-3 py-1.5 text-sm text-(--color-text-muted) hover:bg-(--color-bg-elevated) hover:text-(--color-text-primary)"
              >
                가+
              </button>
              <hr className="border-(--color-border)" />
              <button
                onClick={() => setReaderTheme(nextTheme[readerTheme])}
                className="rounded-lg px-3 py-1.5 text-sm text-(--color-text-muted) hover:bg-(--color-bg-elevated) hover:text-(--color-text-primary)"
              >
                {themeLabels[readerTheme]}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setControlsOpen(!controlsOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg-surface) text-(--color-text-muted) shadow-lg transition-colors hover:text-(--color-text-primary)"
          aria-label="읽기 설정"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
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
      <motion.nav
        className="flex items-center justify-between border-t border-(--color-border) pt-8"
        animate={{ opacity: uiVisible ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      >
        {hasPrev ? (
          <Link
            href={`/novel/${chapterNum - 1}`}
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm text-(--color-text-secondary) transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
          >
            &larr; {chapterNum - 1}화
          </Link>
        ) : (
          <div />
        )}
        <Link
          href="/novel"
          className="text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text-secondary)"
        >
          목차
        </Link>
        {hasNext ? (
          <Link
            href={`/novel/${chapterNum + 1}`}
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm text-(--color-text-secondary) transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
          >
            {chapterNum + 1}화 &rarr;
          </Link>
        ) : (
          <div />
        )}
      </motion.nav>

      {/* 댓글 */}
      <Comments chapter={chapterNum} />
    </>
  );
}
