"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getCompletedChapters, getLastReadChapter } from "@/lib/reading";
import { getUnlockedNodes, getNextUnlock, ALL_WORLD_NODES, NODE_LABELS } from "@/lib/content-unlock";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; created_at?: string } | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<{ chapter: number; readAt: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        setLoading(false);
        return;
      }
      setUser({ email: u.email, created_at: u.created_at });
      const [c, lr] = await Promise.all([getCompletedChapters(), getLastReadChapter()]);
      setCompleted(c);
      setLastRead(lr);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-(--color-text-muted)">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">로그인이 필요합니다</h1>
        <p className="mt-2 text-sm text-(--color-text-muted)">프로필을 보려면 로그인해주세요.</p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block rounded-lg border border-(--color-border-hover) px-6 py-2 text-sm text-(--color-text-secondary) transition-all hover:text-(--color-text-primary)"
        >
          로그인
        </Link>
      </div>
    );
  }

  const unlocked = getUnlockedNodes(completed);
  const next = getNextUnlock(completed);
  const totalChapters = 1; // 현재 공개된 화수
  const progressPercent = totalChapters > 0 ? Math.round((completed.length / totalChapters) * 100) : 0;
  const estimatedReadingMinutes = completed.length * 15; // ~15분/화 추정

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium tracking-widest uppercase text-(--color-text-muted)">프로필</p>
        <h1 className="mt-1 text-2xl font-bold text-(--color-text-primary)">
          {user.email}
        </h1>
        {user.created_at && (
          <p className="mt-1 text-xs text-(--color-text-muted)">
            가입일: {new Date(user.created_at).toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>

      {/* 읽기 현황 */}
      <section className="mb-8 rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-6">
        <h2 className="mb-4 text-sm font-semibold text-(--color-text-primary)">📖 읽기 현황</h2>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
            <span>{completed.length}/{totalChapters}화 완독</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-(--color-bg-elevated)">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, var(--color-accent-cool), var(--color-accent-primary), var(--color-accent-warm))",
              }}
            />
          </div>
        </div>

        {/* 통계 */}
        <div className="mb-3 flex gap-4">
          <div className="rounded-lg bg-(--color-bg-elevated) px-3 py-2 text-center">
            <p className="text-lg font-bold text-(--color-text-primary)">{estimatedReadingMinutes}</p>
            <p className="text-[10px] text-(--color-text-muted)">추정 읽기 시간(분)</p>
          </div>
          <div className="rounded-lg bg-(--color-bg-elevated) px-3 py-2 text-center">
            <p className="text-lg font-bold text-(--color-text-primary)">{completed.length}</p>
            <p className="text-[10px] text-(--color-text-muted)">완독 화수</p>
          </div>
          <div className="rounded-lg bg-(--color-bg-elevated) px-3 py-2 text-center">
            <p className="text-lg font-bold text-(--color-text-primary)">{unlocked.length}</p>
            <p className="text-[10px] text-(--color-text-muted)">해제된 세계관</p>
          </div>
        </div>

        {lastRead && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-(--color-text-muted)">
              마지막 읽은 화: {lastRead.chapter}화
            </p>
            <Link
              href={`/novel/${lastRead.chapter}`}
              className="text-xs font-medium text-(--color-accent-primary) hover:underline"
            >
              이어 읽기 →
            </Link>
          </div>
        )}
      </section>

      {/* 세계관 해제 현황 */}
      <section className="mb-8 rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-6">
        <h2 className="mb-4 text-sm font-semibold text-(--color-text-primary)">
          🔓 세계관 해제 현황 ({unlocked.length}/{ALL_WORLD_NODES.length})
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {ALL_WORLD_NODES.map((nodeId) => {
            const isUnlocked = unlocked.includes(nodeId);
            return (
              <div
                key={nodeId}
                className={`rounded-lg border px-3 py-2 text-center text-xs transition-all ${
                  isUnlocked
                    ? "border-(--color-border-hover) bg-(--color-bg-elevated) text-(--color-text-primary)"
                    : "border-(--color-border) bg-(--color-bg-deep) text-(--color-text-muted) opacity-50"
                }`}
              >
                {isUnlocked ? "✓" : "🔒"} {NODE_LABELS[nodeId] || nodeId}
              </div>
            );
          })}
        </div>

        {next && (
          <p className="mt-4 text-xs text-(--color-text-muted)">
            다음 해제: <strong>{next.chapter}화</strong>를 읽으면{" "}
            <strong>{next.nodes.map((n) => NODE_LABELS[n] || n).join(", ")}</strong> 해제
          </p>
        )}
      </section>

      {/* 완독 화수 */}
      <section className="rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-6">
        <h2 className="mb-4 text-sm font-semibold text-(--color-text-primary)">📊 완독 기록</h2>
        {completed.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
              <Link
                key={ch}
                href={`/novel/${ch}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  completed.includes(ch)
                    ? "bg-(--color-accent-primary)/15 text-(--color-accent-primary) border border-(--color-accent-primary)/30"
                    : "bg-(--color-bg-elevated) text-(--color-text-muted) border border-(--color-border)"
                }`}
              >
                {ch}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-(--color-text-muted)">아직 완독한 화가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
