const ARC_COLORS = [
  "border-cognis/20 bg-cognis/5",
  "border-ador/20 bg-ador/5",
  "border-shiji/20 bg-shiji/5",
  "border-enji/20 bg-enji/5",
  "border-suppress/20 bg-suppress/5",
  "border-hakuten/20 bg-hakuten/5",
  "border-vitalis/20 bg-vitalis/5",
];

interface Arc {
  id: number;
  title: string;
  chapters: string;
  keywords: string;
  synopsis: string;
}

interface ArcOverviewProps {
  arcs: Arc[];
}

export function ArcOverview({ arcs }: ArcOverviewProps) {
  return (
    <div className="space-y-4">
      {arcs.map((arc, i) => (
        <div
          key={arc.id}
          className={`rounded-xl border p-5 transition-colors ${ARC_COLORS[i]}`}
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-bold text-(--color-text-muted)">
              대막 {arc.id}
            </span>
            <h3 className="text-lg font-bold">{arc.title}</h3>
            <span className="ml-auto text-xs text-(--color-text-muted)">{arc.chapters}</span>
          </div>
          <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-3">
            {arc.synopsis}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {arc.keywords.split(", ").map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-xs text-(--color-text-muted)"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
