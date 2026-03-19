const CHROMA_COLORS: Record<string, string> = {
  r: "bg-ador",
  g: "bg-vitalis",
  b: "bg-cognis",
  c: "bg-suppress",
  m: "bg-erode",
  y: "bg-distort",
  k: "bg-void",
};

interface ChromaDisplayProps {
  values: Record<string, number> & { total: number };
}

export function ChromaDisplay({ values }: ChromaDisplayProps) {
  const max = 255;
  const channelOrder = ["r", "g", "b", "c", "m", "y", "k"];
  const channels = channelOrder
    .filter((key) => key in values && key !== "total" && typeof values[key] === "number")
    .map((key) => ({ key, label: key.toUpperCase(), value: values[key] }));

  return (
    <div className="space-y-1.5">
      {channels.map((ch) => (
        <div key={ch.key} className="flex items-center gap-2">
          <span className="w-4 text-xs font-bold text-(--color-text-muted)">{ch.label}</span>
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-(--color-bg-elevated)">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${CHROMA_COLORS[ch.key] || "bg-(--color-border-hover)"} opacity-70`}
              style={{ width: `${(ch.value / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs tabular-nums text-(--color-text-muted)">
            {ch.value}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 border-t border-(--color-border)">
        <span className="w-4 text-xs font-bold text-(--color-text-muted)">T</span>
        <span className="text-xs text-(--color-text-secondary)">총합 {values.total}</span>
      </div>
    </div>
  );
}
