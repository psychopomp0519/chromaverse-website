import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import stormData from "@/content/world/chromastorm.json";

export const metadata: Metadata = {
  title: "크로마스톰",
  description: "색채 에너지 폭풍. 발생 원리, 지역별 차등, 쿠로겐과의 관계.",
};

const EFFECT_COLORS: Record<string, string> = {
  ador: "border-ador/20 bg-ador/5",
  suppress: "border-suppress/20 bg-suppress/5",
  void: "border-void/50 bg-(--color-bg-surface)",
};

export default function ChromastormPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="크로마스톰"
        kanji={stormData.kanji}
        description={stormData.origin.description}
      />

      <div className="space-y-10">
        {/* 쿠로겐 관계 */}
        <section className="rounded-2xl border border-ador/20 bg-ador/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold">{stormData.trueOrigin.title}</h2>
            <span className="rounded-full bg-ador/20 px-2 py-0.5 text-xs text-ador-light">
              {stormData.trueOrigin.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-(--color-text-secondary)">
            {stormData.trueOrigin.description}
          </p>
        </section>

        {/* 존재별 영향 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">RGB/CMYK 영향</h2>
          <div className="space-y-3">
            {stormData.effects.map((effect) => (
              <div
                key={effect.target}
                className={`rounded-xl border p-5 ${EFFECT_COLORS[effect.color] || "border-(--color-border)"}`}
              >
                <h3 className="font-semibold mb-2">{effect.target}</h3>
                <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                  {effect.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 지역별 차등 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">지역별 차등 영향</h2>
          <div className="space-y-3">
            {stormData.regionalEffects.map((re) => (
              <div
                key={re.region}
                className="rounded-xl border border-(--color-border) bg-(--color-bg-elevated) p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{re.region}</h3>
                  <span className="text-xs text-(--color-text-muted)">{re.areas}</span>
                  <span className="ml-auto rounded-full bg-(--color-bg-surface) px-2.5 py-0.5 text-xs text-(--color-text-muted)">
                    {re.type}
                  </span>
                </div>
                <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-2">
                  {re.description}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  발생 빈도: {re.frequency}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 현재 상태 */}
        <section className="rounded-2xl border border-cognis/20 bg-cognis/5 p-6">
          <h2 className="mb-3 text-lg font-bold">현재 상태 — 프리즈마력 1500년</h2>
          <p className="text-sm leading-relaxed text-(--color-text-secondary)">
            {stormData.currentState}
          </p>
        </section>
      </div>
    </div>
  );
}
