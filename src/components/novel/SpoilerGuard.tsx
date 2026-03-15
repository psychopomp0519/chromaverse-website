"use client";

import { useState, useEffect } from "react";
import spoilerMap from "@/content/world/spoiler-map.json";
import { getMaxReadChapter } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";

interface SpoilerGuardProps {
  /** The chapter number after which this content is revealed */
  visibleAfter: number;
  /** Placeholder text shown when spoiler is hidden */
  placeholder?: string;
  children: React.ReactNode;
}

export function SpoilerGuard({
  visibleAfter,
  placeholder,
  children,
}: SpoilerGuardProps) {
  const [revealed, setRevealed] = useState(false);
  const [userMaxChapter, setUserMaxChapter] = useState(
    spoilerMap.currentMaxChapter
  );

  useEffect(() => {
    async function loadUserProgress() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const max = await getMaxReadChapter();
      if (max > 0) setUserMaxChapter(max);
    }
    loadUserProgress();
  }, []);

  const isVisible = userMaxChapter >= visibleAfter;

  if (isVisible || revealed) return <>{children}</>;

  return (
    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="pointer-events-none select-none blur-sm" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-(--color-deep)/80 backdrop-blur-sm">
        <p className="text-sm text-(--color-text-muted)">
          {placeholder || `이 내용은 소설 ${visibleAfter}화 이후에 공개됩니다.`}
        </p>
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-(--color-text-secondary) transition-all hover:border-white/20 hover:text-(--color-text-primary)"
        >
          스포일러 보기
        </button>
      </div>
    </div>
  );
}
