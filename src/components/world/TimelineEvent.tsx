import type { HistoryEvent } from "@/types/world";

interface TimelineEventProps {
  event: HistoryEvent;
}

export function TimelineEvent({ event }: TimelineEventProps) {
  return (
    <div className="group relative flex gap-6 rounded-xl p-4 transition-colors hover:bg-white/[0.02]">
      <div className="relative z-10 mt-1.5">
        <div
          className={`h-[10px] w-[10px] rounded-full border-2 ${
            event.inNovel
              ? "border-ador bg-ador/30"
              : "border-white/20 bg-(--color-deep-card)"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="shrink-0 text-sm font-bold tabular-nums text-(--color-text-muted)">
            {event.yearLabel}
          </span>
          {event.inNovel && <span className="text-xs text-ador-light">&#9733;</span>}
        </div>
        <h3 className="mt-0.5 text-lg font-semibold">{event.title}</h3>
        <p className="mt-1 text-sm text-(--color-text-secondary) leading-relaxed">
          {event.description}
        </p>
        <p className="mt-1 text-xs text-(--color-text-muted)">
          {event.gameVisibility}
        </p>
      </div>
    </div>
  );
}
