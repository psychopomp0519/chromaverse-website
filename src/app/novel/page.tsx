import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { NovelTOC } from "@/components/novel/NovelTOC";
import { ContinueReading } from "@/components/novel/ContinueReading";
import { ReadingProgress } from "@/components/novel/ReadingProgress";
import novelMeta from "@/content/novel/meta.json";
import { getAllChapterNumbers, getAllChapterSummaries } from "@/lib/content";

export const metadata: Metadata = {
  title: "소설 — 크로마버스",
  description: "기록관 카이가 들려주는 700화의 대서사. 빛과 어둠 사이에서 세계를 바꾼 네 사람의 이야기.",
};

export default function NovelPage() {
  const availableChapters = getAllChapterNumbers();
  const chapterSummaries = getAllChapterSummaries();

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="크로마버스"
        kanji="大河小説"
        subtitle="700화의 대서사"
        description="기록관 카이가 들려주는 빛과 어둠의 이야기. 세계를 바꾼 네 사람의 기록."
      />

      {/* 이어읽기 + 진행률 */}
      <section className="mb-12 space-y-4">
        <ContinueReading availableChapters={availableChapters} />
        <ReadingProgress totalChapters={availableChapters} />
      </section>

      {/* 대막 탭 + 목차 */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold">
          목차
          <span className="ml-2 text-sm font-normal text-(--color-text-muted)">
            {availableChapters.length}화 연재 중
          </span>
        </h2>
        <NovelTOC arcs={novelMeta.arcs} chapterSummaries={chapterSummaries} />
      </section>

      {/* 캐릭터 링크 */}
      <section>
        <Link
          href="/novel/characters"
          className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-(--color-deep-card) p-6 transition-all hover:border-white/10"
        >
          <div className="flex-1">
            <h2 className="text-xl font-bold">캐릭터 프로필</h2>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              노이즈 파티 4인의 이야기
            </p>
          </div>
          <span className="text-(--color-text-muted) transition-colors group-hover:text-(--color-text-primary)">
            &rarr;
          </span>
        </Link>
      </section>
    </div>
  );
}
