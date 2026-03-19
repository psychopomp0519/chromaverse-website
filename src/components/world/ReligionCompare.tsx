interface Religion {
  id: string;
  name: string;
  kanji: string;
  doctrine: string;
  luminousStance: string;
  kurogenStance: string;
  base: string;
  color: string;
}

interface ReligionCompareProps {
  religions: Religion[];
}

export function ReligionCompare({ religions }: ReligionCompareProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {religions.map((rel) => (
        <div
          key={rel.id}
          className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-elevated) p-6"
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: rel.color }}
          />
          <div className="mb-4">
            <span className="text-xs text-(--color-text-muted)">{rel.kanji}</span>
            <h2 className="mt-1 text-2xl font-bold">{rel.name}</h2>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-(--color-text-secondary) italic font-(family-name:--font-novel)">
            &ldquo;{rel.doctrine}&rdquo;
          </p>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-(--color-text-muted)">루미나스: </span>
              <span className="text-(--color-text-secondary)">{rel.luminousStance}</span>
            </div>
            <div>
              <span className="text-(--color-text-muted)">쿠로겐: </span>
              <span className="text-(--color-text-secondary)">{rel.kurogenStance}</span>
            </div>
            <div>
              <span className="text-(--color-text-muted)">거점: </span>
              <span className="text-(--color-text-secondary)">{rel.base}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
