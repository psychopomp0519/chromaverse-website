"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReadChapters } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";

interface Volume {
  id: number;
  title: string;
  chapters: number[];
}

interface Arc {
  id: number;
  title: string;
  volumes: Volume[];
}

interface ChapterListProps {
  arcs: Arc[];
  availableChapters: number[];
}

export function ChapterList({ arcs, availableChapters }: ChapterListProps) {
  const [readChapters, setReadChapters] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const chapters = await getReadChapters();
      setReadChapters(chapters);
    }
    load();
  }, []);

  return (
    <div>
      {arcs
        .filter((arc) =>
          arc.volumes.some((v) =>
            availableChapters.some(
              (ch) => ch >= v.chapters[0] && ch <= v.chapters[1]
            )
          )
        )
        .map((arc) => (
          <div key={arc.id} className="mb-8">
            <h3 className="mb-3 text-sm font-bold text-(--color-text-muted) uppercase tracking-wider">
              대막 {arc.id}: {arc.title}
            </h3>
            {arc.volumes
              .filter((v) =>
                availableChapters.some(
                  (ch) => ch >= v.chapters[0] && ch <= v.chapters[1]
                )
              )
              .map((volume) => (
                <div key={volume.id} className="mb-4">
                  <p className="mb-2 text-sm font-medium text-(--color-text-secondary)">
                    {volume.id}권: {volume.title}
                  </p>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                    {Array.from(
                      { length: volume.chapters[1] - volume.chapters[0] + 1 },
                      (_, idx) => volume.chapters[0] + idx
                    ).map((ch) => {
                      const available = availableChapters.includes(ch);
                      const isRead = readChapters.includes(ch);
                      return available ? (
                        <Link
                          key={ch}
                          href={`/novel/${ch}`}
                          className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                            isRead
                              ? "border-[var(--color-vitalis)]/30 bg-[var(--color-vitalis)]/10 text-[var(--color-vitalis)]"
                              : "border-white/10 hover:border-cognis/30 hover:bg-cognis/10"
                          }`}
                        >
                          {ch}
                          {isRead && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--color-vitalis)] text-[8px] text-white">
                              ✓
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div
                          key={ch}
                          className="flex h-10 items-center justify-center rounded-lg border border-white/[0.03] text-sm text-(--color-text-muted)/30"
                        >
                          {ch}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
