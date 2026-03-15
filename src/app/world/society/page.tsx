import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SocialTierChart } from "@/components/world/SocialTierChart";
import societyData from "@/content/world/society.json";
import type { SocialTier } from "@/types/world";

export const metadata: Metadata = {
  title: "사회 · 코드 체계",
  description: "색채 계층 구조와 코드(和音) 사회 체계.",
};

export default function SocietyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="사회 계층과 코드 체계"
        kanji="和音"
        description={societyData.coreConflict}
      />

      <SocialTierChart tiers={societyData.rgbTiers as SocialTier[]} system="rgb" title="RGB 계층" />

      <SocialTierChart
        tiers={societyData.cmykTiers as SocialTier[]}
        system="cmyk"
        title="CMYK 계층 — 잔향 체계"
        subtitle="묵렌 사회에서는 총합보다 K값이 사회적 지위에 더 큰 영향을 미친다."
      />

      {/* Code System */}
      <section>
        <h2 className="mb-2 text-xl font-bold">{societyData.code.title}</h2>
        <p className="mb-6 text-(--color-text-secondary)">{societyData.code.description}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {societyData.code.elements.map((el) => (
            <div
              key={el.name}
              className="rounded-xl border border-white/5 bg-(--color-deep-card) p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{el.name}</span>
                <span className="text-xs text-(--color-text-muted)">{el.kanji}</span>
              </div>
              <p className="text-sm text-(--color-text-secondary) leading-relaxed">{el.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
