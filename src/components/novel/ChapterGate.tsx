"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isReleased, getNextRelease } from "@/lib/schedule";

interface ChapterGateProps {
  chapter: number;
  children: React.ReactNode;
}

export function ChapterGate({ chapter, children }: ChapterGateProps) {
  const [allowed, setAllowed] = useState<boolean | null>(() => isReleased(chapter));
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    function check() {
      const now = new Date();
      const released = isReleased(chapter, now);
      setAllowed(released);

      if (!released) {
        const next = getNextRelease(now);
        if (next && next.chapter === chapter) {
          const diffMs = next.releaseDate.getTime() - now.getTime();
          const days = Math.floor(diffMs / (86400000));
          const hours = Math.floor((diffMs % 86400000) / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          setCountdown({ days, hours, minutes });
        }
      }
    }

    check();
    const timer = setInterval(check, 60000); // 1분마다 갱신
    return () => clearInterval(timer);
  }, [chapter]);

  // 로딩 중
  if (allowed === null) {
    return <div className="py-32 text-center text-(--color-text-muted)">로딩 중...</div>;
  }

  // 공개됨
  if (allowed) {
    return <>{children}</>;
  }

  // 미공개 — 카운트다운
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 text-4xl">🔒</div>

      <h2 className="mb-2 text-xl font-bold text-(--color-text-primary)">
        {chapter}화는 아직 공개되지 않았습니다
      </h2>

      <p className="mb-8 text-sm text-(--color-text-muted)">
        공개까지 남은 시간
      </p>

      {/* Countdown Timer */}
      <div className="mb-8 flex items-center gap-4">
        <CountdownUnit value={countdown.days} label="일" />
        <span className="text-xl text-(--color-text-muted)">:</span>
        <CountdownUnit value={countdown.hours} label="시간" />
        <span className="text-xl text-(--color-text-muted)">:</span>
        <CountdownUnit value={countdown.minutes} label="분" />
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {chapter > 1 && (
          <Link
            href={`/novel/${chapter - 1}`}
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm text-(--color-text-secondary) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
          >
            &larr; {chapter - 1}화 읽기
          </Link>
        )}
        <Link
          href="/novel"
          className="rounded-lg border border-(--color-border) px-4 py-2 text-sm text-(--color-text-secondary) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
        >
          목차로
        </Link>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold tabular-nums text-(--color-text-primary)">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs text-(--color-text-muted)">{label}</span>
    </div>
  );
}
