"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMaxReadChapter } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";

interface ContinueReadingProps {
  availableChapters?: number[];
}

export function ContinueReading({ availableChapters }: ContinueReadingProps) {
  const [targetChapter, setTargetChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const maxRead = await getMaxReadChapter();

      if (maxRead === 0) {
        setTargetChapter(1);
      } else {
        const nextChapter = maxRead + 1;
        if (availableChapters?.includes(nextChapter)) {
          setTargetChapter(nextChapter);
        } else {
          setTargetChapter(maxRead);
        }
      }
      setLoading(false);
    }
    load();
  }, [availableChapters]);

  if (loading || targetChapter === null) return null;

  return (
    <Link
      href={`/novel/${targetChapter}`}
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-ador)] via-[var(--color-vitalis)] to-[var(--color-cognis)] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      {targetChapter === 1 ? "1화부터 읽기" : `${targetChapter}화 이어읽기`}
    </Link>
  );
}
