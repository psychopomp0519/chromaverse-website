import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import economyData from "@/content/world/economy.json";

export const metadata: Metadata = {
  title: "경제 — 레스 체계",
  description: "크로마라의 유일한 통화 레스와 크로마튜너.",
};

export default function EconomyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="경제 — 레스 체계"
        kanji="共鳴石"
        description="색채 에너지가 자연 결정화된 크로마라의 유일한 통화."
      />

      <div className="space-y-8">
        <section className="rounded-2xl border border-koji/20 bg-koji/5 p-8">
          <div className="mb-4">
            <span className="text-xs text-(--color-text-muted)">{economyData.currency.kanji}</span>
            <h2 className="mt-1 text-2xl font-bold">{economyData.currency.name}</h2>
          </div>
          <p className="leading-relaxed text-(--color-text-secondary) font-(family-name:--font-novel)">
            {economyData.currency.description}
          </p>
          <p className="mt-4 leading-relaxed text-(--color-text-secondary)">
            {economyData.currency.value}
          </p>
        </section>

        <section className="rounded-2xl border border-(--color-border) bg-(--color-bg-elevated) p-8">
          <div className="mb-4">
            <span className="text-xs text-(--color-text-muted)">{economyData.profession.kanji}</span>
            <h2 className="mt-1 text-2xl font-bold">{economyData.profession.name}</h2>
          </div>
          <p className="leading-relaxed text-(--color-text-secondary)">
            {economyData.profession.description}
          </p>
        </section>
      </div>
    </div>
  );
}
