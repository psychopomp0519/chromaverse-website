import type { SocialTier } from "@/types/world";

interface SocialTierChartProps {
  tiers: SocialTier[];
  system: "rgb" | "cmyk";
  title: string;
  subtitle?: string;
}

export function SocialTierChart({ tiers, system, title, subtitle }: SocialTierChartProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-xl font-bold">
        {system === "rgb" ? <span className="text-gradient-rgb">{title}</span> : title}
      </h2>
      {subtitle && <p className="mb-4 text-sm text-(--color-text-muted)">{subtitle}</p>}

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--color-border-hover) text-left">
              <th className="pb-3 pr-3 font-semibold">계층</th>
              <th className="pb-3 pr-3 font-semibold">한자</th>
              <th className="pb-3 pr-3 font-semibold">총합</th>
              <th className="pb-3 pr-3 font-semibold">사회적 위치</th>
              <th className="pb-3 pr-3 font-semibold">수명</th>
              <th className="pb-3 font-semibold">특이사항</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={tier.id} className={`border-b border-(--color-border) ${i === 0 && system === "rgb" ? "text-hakuten" : ""}`}>
                <td className="py-3 pr-3 font-medium">{tier.name}</td>
                <td className="py-3 pr-3 text-(--color-text-muted)">{tier.kanji}</td>
                <td className="py-3 pr-3 tabular-nums text-(--color-text-secondary)">{tier.totalRange}</td>
                <td className="py-3 pr-3 text-(--color-text-secondary)">{tier.socialPosition}</td>
                <td className="py-3 pr-3 text-(--color-text-secondary)">{tier.lifespan}</td>
                <td className="py-3 text-(--color-text-muted) text-xs">{tier.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-3">
        {tiers.map((tier, i) => (
          <div
            key={tier.id}
            className={`rounded-xl border border-(--color-border) bg-(--color-bg-elevated) p-4 ${i === 0 && system === "rgb" ? "text-hakuten" : ""}`}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-semibold text-base">{tier.name}</span>
              <span className="text-xs text-(--color-text-muted)">{tier.kanji}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p><span className="text-(--color-text-muted)">총합: </span><span className="tabular-nums text-(--color-text-secondary)">{tier.totalRange}</span></p>
              <p><span className="text-(--color-text-muted)">수명: </span><span className="text-(--color-text-secondary)">{tier.lifespan}</span></p>
              <p className="col-span-2"><span className="text-(--color-text-muted)">위치: </span><span className="text-(--color-text-secondary)">{tier.socialPosition}</span></p>
            </div>
            {tier.notes && (
              <p className="mt-2 text-xs text-(--color-text-muted) leading-relaxed">{tier.notes}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
