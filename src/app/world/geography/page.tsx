import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { InteractiveMap } from "@/components/world/InteractiveMap";
import regions from "@/content/world/geography.json";

export const metadata: Metadata = {
  title: "지리 — 크로마라",
  description: "크로마라의 9개 지역. 하쿠텐, 프라이머리, 블렌드, 보더, 더 딥.",
};

const GROUP_LABELS: Record<string, string> = {
  center: "중앙",
  primary: "프라이머리 — 삼원역",
  blend: "블렌드 — 혼합역",
  border: "전이 지대",
  deep: "심묵 영역",
};

const GROUP_ORDER = ["center", "primary", "blend", "border", "deep"];

export default function GeographyPage() {
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    regions: regions.filter((r) => r.group === group),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="크로마라의 지리"
        kanji="彩界"
        description="프리즈마폴로 태어난 세계. 빛의 중심 하쿠텐에서 어둠의 더 딥까지 9개 지역."
      />

      <InteractiveMap />

      <h2 className="mb-6 text-lg font-bold text-(--color-text-secondary)">전체 지역 목록</h2>
      <div className="space-y-12">
        {grouped.map(({ group, label, regions: groupRegions }) => (
          <section key={group}>
            <h2 className="mb-4 text-lg font-bold text-(--color-text-secondary)">{label}</h2>
            <div className={`grid gap-4 ${group === "center" || group === "border" || group === "deep" ? "" : "sm:grid-cols-3"}`}>
              {groupRegions.map((region) => (
                <div
                  key={region.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-(--color-deep-card) p-6 transition-all hover:border-white/10"
                >
                  {/* Color accent bar */}
                  <div
                    className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5"
                    style={{ backgroundColor: region.color }}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className="mt-1 h-12 w-12 shrink-0 rounded-xl opacity-80"
                      style={{ backgroundColor: region.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{region.name}</h3>
                        <span className="text-xs text-(--color-text-muted)">{region.kanji}</span>
                      </div>
                      <p className="mt-1 text-sm text-(--color-text-secondary)">
                        {region.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-(--color-text-secondary)">
                      {region.characteristics}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {region.dominantChannel && (
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-(--color-text-muted)">
                          {region.dominantChannel}
                        </span>
                      )}
                      {region.saturationRange && (
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-(--color-text-muted)">
                          채도 {region.saturationRange}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
