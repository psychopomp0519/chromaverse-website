"use client";

import { useState, useEffect } from "react";
import { getNextRelease } from "@/lib/schedule";

export function NextReleaseCard() {
  const [next, setNext] = useState<{
    chapter: number;
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    function update() {
      const now = new Date();
      const release = getNextRelease(now);
      if (!release) {
        setNext(null);
        return;
      }
      const diffMs = release.releaseDate.getTime() - now.getTime();
      setNext({
        chapter: release.chapter,
        days: Math.floor(diffMs / 86400000),
        hours: Math.floor((diffMs % 86400000) / 3600000),
        minutes: Math.floor((diffMs % 3600000) / 60000),
      });
    }

    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!next) return null;

  return (
    <div className="mb-8 rounded-2xl border border-cognis/20 bg-(--color-bg-elevated) p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-cognis mb-3">
        다음 연재
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-(--color-text-primary)">
            {next.chapter}화
          </p>
          <p className="text-sm text-(--color-text-muted)">공개 예정</p>
        </div>

        <div className="flex items-center gap-3 text-center">
          <div>
            <span className="text-2xl font-bold tabular-nums text-(--color-text-primary)">
              {next.days}
            </span>
            <span className="block text-[10px] text-(--color-text-muted)">일</span>
          </div>
          <span className="text-(--color-text-muted)">:</span>
          <div>
            <span className="text-2xl font-bold tabular-nums text-(--color-text-primary)">
              {String(next.hours).padStart(2, "0")}
            </span>
            <span className="block text-[10px] text-(--color-text-muted)">시간</span>
          </div>
          <span className="text-(--color-text-muted)">:</span>
          <div>
            <span className="text-2xl font-bold tabular-nums text-(--color-text-primary)">
              {String(next.minutes).padStart(2, "0")}
            </span>
            <span className="block text-[10px] text-(--color-text-muted)">분</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-cognis/10">
        <div
          className="h-full rounded-full bg-cognis/40 transition-all duration-1000"
          style={{
            width: `${Math.max(5, 100 - (next.days * 24 + next.hours) / (14 * 24) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
