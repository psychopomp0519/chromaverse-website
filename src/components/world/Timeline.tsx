import { TimelineEvent } from "./TimelineEvent";
import type { HistoryEvent } from "@/types/world";

interface TimelineProps {
  events: HistoryEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-1">
        {events.map((event) => (
          <TimelineEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
