import type { GlossaryEntry } from "@/types/world";

interface GlossaryCardProps {
  entry: GlossaryEntry;
  allEntries: GlossaryEntry[];
}

export function GlossaryCard({ entry, allEntries }: GlossaryCardProps) {
  return (
    <details className="group rounded-xl border border-(--color-border) bg-(--color-bg-elevated) transition-colors hover:border-(--color-border-hover)">
      <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-xs text-(--color-text-muted) transition-transform group-open:rotate-90">
          &#9656;
        </span>
        <span className="font-semibold">{entry.term}</span>
        <span className="text-xs text-(--color-text-muted)">{entry.kanji}</span>
        <span className="ml-auto rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-xs text-(--color-text-muted)">
          {entry.category}
        </span>
      </summary>
      <div className="border-t border-(--color-border) px-5 py-4">
        <p className="text-sm font-medium text-(--color-text-secondary) mb-2">
          {entry.shortDesc}
        </p>
        <p className="text-sm text-(--color-text-secondary) leading-relaxed">
          {entry.fullDesc}
        </p>
        {entry.relatedTerms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-(--color-text-muted)">관련:</span>
            {entry.relatedTerms.map((rel) => {
              const related = allEntries.find((g) => g.id === rel);
              return (
                <span
                  key={rel}
                  className="rounded-full bg-(--color-bg-surface) px-2 py-0.5 text-xs text-(--color-text-muted)"
                >
                  {related?.term || rel}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </details>
  );
}
