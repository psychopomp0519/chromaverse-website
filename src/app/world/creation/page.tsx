import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import creationData from "@/content/world/creation.json";

export const metadata: Metadata = {
  title: "창세 신화 — 프리즈마폴",
  description: "루미나스와 쿠로겐, 그리고 프리즈마폴. 크로마라 세계가 어떻게 탄생했는가.",
};

const SECTION_COLORS: Record<string, string> = {
  hakuten: "border-hakuten/20 hover:border-hakuten/40",
  ador: "border-ador/20 hover:border-ador/40",
  void: "border-void/50 hover:border-void/80",
  cognis: "border-cognis/20 hover:border-cognis/40",
};

const SECTION_ACCENTS: Record<string, string> = {
  hakuten: "bg-hakuten/5",
  ador: "bg-ador/5",
  void: "bg-white/[0.02]",
  cognis: "bg-cognis/5",
};

const CHANNEL_COLORS: Record<string, string> = {
  C: "text-suppress-light",
  M: "text-erode-light",
  Y: "text-distort-light",
  K: "text-(--color-text-muted)",
};

export default function CreationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="창세 신화"
        kanji="大散光"
        subtitle="프리즈마폴"
        description="세계 크로마라는 어떻게 탄생했는가. 빛과 어둠의 기원."
      />

      <div className="space-y-8">
        {creationData.sections.map((section) => (
          <section
            key={section.id}
            className={`rounded-2xl border ${SECTION_COLORS[section.color] || "border-white/5"} ${SECTION_ACCENTS[section.color] || ""} p-8 transition-colors`}
          >
            <div className="mb-4">
              {section.kanji && (
                <p className="text-xs font-medium tracking-wider text-(--color-text-muted)">
                  {section.kanji}
                </p>
              )}
              <h2 className="mt-1 text-2xl font-bold">{section.title}</h2>
            </div>

            {section.content && (
              <p className="leading-relaxed text-(--color-text-secondary) font-(family-name:--font-novel)">
                {section.content}
              </p>
            )}

            {"note" in section && section.note && (
              <p className="mt-4 rounded-lg bg-white/[0.03] p-4 text-sm italic text-(--color-text-muted) leading-relaxed">
                {section.note}
              </p>
            )}

            {"aspects" in section && section.aspects && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {section.aspects.map((aspect) => (
                  <div
                    key={aspect.channel}
                    className="rounded-xl border border-white/5 bg-(--color-deep-card) p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${CHANNEL_COLORS[aspect.channel] || ""}`}>
                        {aspect.channel}
                      </span>
                      <span className="font-semibold">{aspect.name}</span>
                      <span className="text-xs text-(--color-text-muted)">{aspect.kanji}</span>
                    </div>
                    <p className="mt-2 text-sm text-(--color-text-secondary) leading-relaxed">
                      {aspect.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {"points" in section && section.points && (
              <ul className="mt-4 space-y-3">
                {section.points.map((point, i) => (
                  <li key={i} className="flex gap-3 text-(--color-text-secondary)">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cognis/50" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
