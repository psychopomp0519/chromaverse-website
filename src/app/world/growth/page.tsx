import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import growthData from "@/content/world/growth.json";
import { WorldHero } from "@/components/world/WorldHero";

export const metadata: Metadata = {
  title: "성장 체계",
  description: "사이도, 스플릿, 크로마시프트, 탈색, 산포, 반전, 잠재 현현.",
};

const COLOR_MAP: Record<string, { border: string; bg: string }> = {
  vitalis: { border: "border-vitalis/20", bg: "bg-vitalis/5" },
  cognis: { border: "border-cognis/20", bg: "bg-cognis/5" },
  koji: { border: "border-koji/20", bg: "bg-koji/5" },
  ador: { border: "border-ador/20", bg: "bg-ador/5" },
  hakuten: { border: "border-hakuten/20", bg: "bg-hakuten/5" },
  border: { border: "border-border/20", bg: "bg-border/5" },
  shiji: { border: "border-shiji/20", bg: "bg-shiji/5" },
};

export default function GrowthPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <WorldHero section="growth" alt="성장" />
      <SectionHeader
        title="성장 체계"
        kanji="彩度 · 分光"
        description="크로마라 세계의 성장, 변화, 그리고 특수 현상."
      />

      <div className="space-y-4">
        {growthData.systems.map((system) => {
          const style = COLOR_MAP[system.color] || { border: "border-(--color-border)", bg: "" };
          return (
            <section
              key={system.id}
              className={`rounded-2xl border ${style.border} ${style.bg} p-6 transition-colors`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-(--color-text-muted)">{system.kanji}</span>
                <span className="rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-xs text-(--color-text-muted)">
                  {system.type}
                </span>
              </div>
              <h2 className="text-xl font-bold">{system.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
                {system.description}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
