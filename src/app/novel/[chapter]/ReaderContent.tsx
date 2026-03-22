"use client";

import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useReaderStore } from "@/stores/reader";
import { useUnlockStore } from "@/stores/unlock";
import { buildGlossaryContext, highlightGlossaryTerms } from "@/components/novel/GlossaryPopup";
import { Comments } from "@/components/novel/Comments";
import { UnlockNotification } from "@/components/user/UnlockNotification";
import { upsertReadingProgress, markChapterCompleted, saveScrollPosition, getScrollPosition } from "@/lib/reading";
import { GlowBar } from "@/components/core/GlowBar";
import type { ChapterData } from "@/lib/content";

interface ReaderContentProps {
  chapter: ChapterData;
  chapterNum: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ReaderContent({ chapter, chapterNum, hasPrev, hasNext }: ReaderContentProps) {
  const { fontSize, lineHeight, increaseFontSize, decreaseFontSize, cycleLineHeight, readerTheme, setReaderTheme } = useReaderStore();
  const { theme: siteTheme } = useTheme();
  const markComplete = useUnlockStore((s) => s.markChapterComplete);
  const [progress, setProgress] = useState(0);

  // Sync reader theme with site theme on mount and when site theme changes
  useEffect(() => {
    const resolved = siteTheme || document.documentElement.getAttribute("data-theme") || "dark";
    if (resolved === "light" && readerTheme === "dark") {
      setReaderTheme("light");
    } else if (resolved === "dark" && readerTheme === "light") {
      setReaderTheme("dark");
    }
  }, [siteTheme]);
  const [uiVisible, setUiVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showUnlock, setShowUnlock] = useState(false);
  const completedRef = useRef(false);

  // 읽기 기록 저장
  useEffect(() => {
    upsertReadingProgress(chapterNum).then((res) => {
      if (res.error) console.error("[reading] upsert failed:", res.error);
    });
    completedRef.current = false;

    // Restore scroll position: Supabase first, localStorage fallback
    getScrollPosition(chapterNum).then((pos) => {
      const localSaved = localStorage.getItem(`scroll-ch-${chapterNum}`);
      const scrollTo = pos > 0 ? pos : localSaved ? Number(localSaved) : 0;
      if (scrollTo > 0) {
        requestAnimationFrame(() => window.scrollTo(0, scrollTo));
      }
    });
  }, [chapterNum]);

  // Save scroll position to localStorage + Supabase (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let dbTimer: ReturnType<typeof setTimeout>;
    function saveScroll() {
      clearTimeout(timer);
      clearTimeout(dbTimer);
      timer = setTimeout(() => {
        localStorage.setItem(`scroll-ch-${chapterNum}`, String(window.scrollY));
      }, 300);
      // Supabase save less frequently (5s debounce)
      dbTimer = setTimeout(() => {
        saveScrollPosition(chapterNum, window.scrollY);
      }, 5000);
    }
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      clearTimeout(dbTimer);
      window.removeEventListener("scroll", saveScroll);
    };
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

        // 완독 감지 (95% 이상 스크롤 시)
        if (p >= 0.95 && !completedRef.current) {
          completedRef.current = true;
          markChapterCompleted(chapterNum).then(() => {
            const unlocked = markComplete(chapterNum);
            if (unlocked.length > 0) {
              setNewlyUnlocked(unlocked);
              setShowUnlock(true);
            }
          });
        }

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

  // 장면 전환 배경색 — progress에 따라 미묘한 색온도 변화 (3s transition)
  const sceneHue = readerTheme === "dark"
    ? `hsl(230, 12%, ${8 + progress * 4}%)`    // 어둠: 8~12% (가독성 확보)
    : readerTheme === "sepia"
    ? `hsl(${35 + progress * 10}, 40%, ${97 - progress * 3}%)` // 세피아: 따뜻해짐
    : undefined; // 라이트는 그대로

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
              <button
                onClick={cycleLineHeight}
                className="rounded-lg px-3 py-1.5 text-sm text-(--color-text-muted) hover:bg-(--color-bg-elevated) hover:text-(--color-text-primary)"
              >
                행간 {lineHeight}
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
        className={`mb-16 rounded-2xl p-6 sm:p-8 font-(family-name:--font-novel) ${themeStyles.bg} ${themeStyles.text}`}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          backgroundColor: sceneHue,
          transition: "background-color 3s ease, color 0.3s ease",
        }}
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

      {/* 해제 알림 */}
      <UnlockNotification
        nodes={newlyUnlocked}
        visible={showUnlock}
        onDismiss={() => setShowUnlock(false)}
      />
    </>
  );
}
