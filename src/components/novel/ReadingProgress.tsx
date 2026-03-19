"use client";

import { useEffect, useState } from "react";
import { getReadChapters } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";

interface ReadingProgressProps {
  totalChapters: number[];
}

export function ReadingProgress({ totalChapters }: ReadingProgressProps) {
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setIsLoggedIn(true);

      const chapters = await getReadChapters();
      setReadChapters(chapters);
    }
    load();
  }, []);

  if (!isLoggedIn) return null;

  const readCount = readChapters.length;
  const total = totalChapters.length;
  const percent = total > 0 ? Math.round((readCount / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-xs text-(--color-text-muted)">
        <span>읽기 진행률</span>
        <span>
          {readCount}/{total}화 ({percent}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-(--color-bg-elevated)">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-ador)] via-[var(--color-vitalis)] to-[var(--color-cognis)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
