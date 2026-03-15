interface Feature {
  name: string;
  kanji?: string;
  desc: string;
}

interface LifespanTier {
  tier: string;
  range: string;
  years: string;
}

interface RaceCardProps {
  name: string;
  kanji: string;
  system: string;
  subtitle: string;
  description: string;
  features?: Feature[];
  lifespan?: LifespanTier[];
  kNote?: string;
}

const SYSTEM_STYLES = {
  rgb: { border: "border-ador/20", bg: "bg-ador/5", tag: "text-ador-light" },
  cmyk: { border: "border-suppress/20", bg: "bg-suppress/5", tag: "text-suppress-light" },
};

export function RaceCard({ name, kanji, system, subtitle, description, features, lifespan, kNote }: RaceCardProps) {
  const style = SYSTEM_STYLES[system as keyof typeof SYSTEM_STYLES] || { border: "border-white/5", bg: "", tag: "" };

  return (
    <section className={`rounded-2xl border ${style.border} ${style.bg} p-5 sm:p-8 transition-colors`}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase ${style.tag}`}>{system.toUpperCase()}</span>
          <span className="text-xs text-(--color-text-muted)">{kanji}</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold">{name}</h2>
        <p className="text-sm text-(--color-text-secondary)">{subtitle}</p>
      </div>

      <p className="leading-relaxed text-(--color-text-secondary)">{description}</p>

      {features && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider">고유 특성</h3>
          {features.map((feat) => (
            <div key={feat.name} className="rounded-xl border border-white/5 bg-(--color-deep-card) p-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{feat.name}</span>
                {feat.kanji && <span className="text-xs text-(--color-text-muted)">{feat.kanji}</span>}
              </div>
              <p className="mt-1 text-sm text-(--color-text-secondary)">{feat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {lifespan && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider">계층별 수명</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-(--color-text-muted)">
                  <th className="pb-2 pr-4 font-medium">계층</th>
                  <th className="pb-2 pr-4 font-medium">총합</th>
                  <th className="pb-2 font-medium">수명</th>
                </tr>
              </thead>
              <tbody>
                {lifespan.map((tier) => (
                  <tr key={tier.tier} className="border-b border-white/[0.03]">
                    <td className="py-2 pr-4 font-medium">{tier.tier}</td>
                    <td className="py-2 pr-4 text-(--color-text-secondary)">{tier.range}</td>
                    <td className="py-2 text-(--color-text-secondary)">{tier.years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {kNote && (
        <p className="mt-4 rounded-lg bg-white/[0.03] p-4 text-sm italic text-(--color-text-muted) leading-relaxed">
          {kNote}
        </p>
      )}
    </section>
  );
}
