import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { RaceCard } from "@/components/world/RaceCard";
import racesData from "@/content/world/races.json";

export const metadata: Metadata = {
  title: "종족 — 렌과 묵렌",
  description: "빛의 존재 렌, 어둠의 존재 묵렌, 그리고 이로쥬와 보쿠쥬.",
};

export default function RacesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="종족과 존재"
        kanji="煉 · 墨煉"
        description="루미나스의 파편에서 태어난 빛의 존재 렌, 쿠로겐에서 비롯된 어둠의 존재 묵렌."
      />

      <div className="space-y-8">
        {racesData.races.map((race) => (
          <RaceCard
            key={race.id}
            name={race.name}
            kanji={race.kanji}
            system={race.system}
            subtitle={race.subtitle}
            description={race.description}
            features={"features" in race ? race.features : undefined}
            lifespan={"lifespan" in race ? race.lifespan : undefined}
            kNote={"kNote" in race ? race.kNote : undefined}
          />
        ))}

        {/* 렌-묵렌 관계 */}
        <section className="rounded-2xl border border-border/20 bg-border/5 p-5 sm:p-8">
          <h2 className="text-2xl font-bold">{racesData.relationship.title}</h2>
          <p className="mt-4 leading-relaxed text-(--color-text-secondary)">
            {racesData.relationship.content}
          </p>
          <p className="mt-4 leading-relaxed text-(--color-text-secondary)">
            {racesData.relationship.reversal}
          </p>
        </section>
      </div>
    </div>
  );
}
