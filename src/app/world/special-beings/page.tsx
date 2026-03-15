import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import data from "@/content/world/special-beings.json";

export const metadata: Metadata = {
  title: "특수 존재",
  description: "잠재 현현, 반전, 렌과 묵렌의 경계에 있는 존재들.",
};

const TYPE_COLORS: Record<string, string> = {
  border: "border-border/20 bg-border/5",
  hakuten: "border-hakuten/20 bg-hakuten/5",
};

export default function SpecialBeingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="특수 존재"
        kanji="潜在顕現 · 反転"
        description="프리즈마폴의 특수한 에너지에서 비롯된 존재들. 빛과 어둠의 경계."
      />

      <div className="space-y-10">
        {/* 잠재 현현 */}
        <section>
          <div className="mb-6">
            <span className="text-xs text-(--color-text-muted)">{data.jamjaeHyunhyun.kanji}</span>
            <h2 className="mt-1 text-2xl font-bold">{data.jamjaeHyunhyun.title}</h2>
            <p className="mt-3 leading-relaxed text-(--color-text-secondary)">
              {data.jamjaeHyunhyun.description}
            </p>
            <p className="mt-2 text-sm italic text-(--color-text-muted)">
              {data.jamjaeHyunhyun.note}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.jamjaeHyunhyun.types.map((type) => (
              <div
                key={type.id}
                className={`rounded-2xl border p-6 ${TYPE_COLORS[type.color] || "border-white/5"}`}
              >
                <div className="mb-3">
                  <span className="text-xs text-(--color-text-muted)">{type.example}</span>
                  <h3 className="mt-1 text-xl font-bold">{type.name}</h3>
                </div>
                <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-3">
                  {type.description}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-(--color-text-muted)">특성: </span>
                    <span className="text-(--color-text-secondary)">{type.traits}</span>
                  </p>
                  <p>
                    <span className="text-(--color-text-muted)">시간: </span>
                    <span className="text-(--color-text-secondary)">{type.timeline}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-xl bg-white/[0.03] p-4 text-sm italic text-(--color-text-muted) leading-relaxed">
            {data.jamjaeHyunhyun.significance}
          </p>
        </section>

        {/* 반전 */}
        <section className="rounded-2xl border border-ador/20 bg-ador/5 p-8">
          <span className="text-xs text-(--color-text-muted)">{data.banjeon.kanji}</span>
          <h2 className="mt-1 text-2xl font-bold">{data.banjeon.title}</h2>
          <p className="mt-3 leading-relaxed text-(--color-text-secondary)">
            {data.banjeon.description}
          </p>
          <ul className="mt-4 space-y-3">
            {data.banjeon.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-sm text-(--color-text-secondary)">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ador/50" />
                <span className="leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 렌-묵렌 자녀 */}
        <section className="rounded-2xl border border-shiji/20 bg-shiji/5 p-8">
          <h2 className="text-2xl font-bold">{data.renMokurenRelation.title}</h2>
          <p className="mt-3 leading-relaxed text-(--color-text-secondary)">
            {data.renMokurenRelation.description}
          </p>
        </section>
      </div>
    </div>
  );
}
