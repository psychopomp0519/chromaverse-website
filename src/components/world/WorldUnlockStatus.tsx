"use client";

import { useEffect, useState } from "react";
import { getMaxReadChapter } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";
import spoilerMap from "@/content/world/spoiler-map.json";

export function WorldUnlockStatus() {
  const [userMax, setUserMax] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setIsLoggedIn(true);

      const max = await getMaxReadChapter();
      setUserMax(max);
    }
    load();
  }, []);

  if (!isLoggedIn) return null;

  // 모든 스포일러 섹션에서 필요한 최대 챕터 수집
  const allSpoilers: number[] = [];
  for (const sectionSpoilers of Object.values(spoilerMap.sections)) {
    for (const s of sectionSpoilers) {
      if (typeof s === "object" && "visibleAfter" in s) {
        allSpoilers.push(s.visibleAfter);
      }
    }
  }
  // 용어 스포일러
  for (const ch of Object.values(spoilerMap.terms)) {
    allSpoilers.push(ch);
  }
  // 캐릭터 스포일러
  for (const ch of Object.values(spoilerMap.characters)) {
    allSpoilers.push(ch);
  }

  if (allSpoilers.length === 0) return null;

  const currentMax = userMax ?? 0;
  const unlocked = allSpoilers.filter((ch) => currentMax >= ch).length;
  const total = allSpoilers.length;
  const percent = Math.round((unlocked / total) * 100);

  return (
    <div className="mb-12 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">세계관 잠금해제</span>
        <span className="text-(--color-text-muted)">
          {unlocked}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-ador)] via-[var(--color-vitalis)] to-[var(--color-cognis)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-(--color-text-muted)">
        소설을 읽을수록 더 많은 세계관 정보가 해제됩니다.
        {currentMax > 0 && ` (현재 ${currentMax}화까지 읽음)`}
      </p>
    </div>
  );
}
