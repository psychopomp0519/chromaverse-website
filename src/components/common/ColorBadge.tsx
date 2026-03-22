import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  ador: "bg-ador/20 text-ador-light",
  vitalis: "bg-vitalis/20 text-vitalis-light",
  cognis: "bg-cognis/20 text-cognis-light",
  suppress: "bg-suppress/20 text-suppress-light",
  erode: "bg-erode/20 text-erode-light",
  distort: "bg-distort/20 text-distort-light",
  void: "bg-void/20 text-(--color-text-muted)",
  hakuten: "bg-hakuten/10 text-hakuten",
  enji: "bg-enji/20 text-enji",
  seiji: "bg-seiji/20 text-seiji",
  meichi: "bg-meichi/20 text-meichi",
  koji: "bg-koji/20 text-koji",
  shiji: "bg-shiji/20 text-shiji",
  aochi: "bg-aochi/20 text-aochi",
  border: "bg-border/20 text-border",
  rgb: "bg-gradient-to-r from-ador/20 via-vitalis/20 to-cognis/20 text-(--color-text-primary)",
  cmyk: "bg-gradient-to-r from-suppress/20 via-erode/20 to-distort/20 text-(--color-text-secondary)",
};

interface ColorBadgeProps {
  color: string;
  children: React.ReactNode;
  className?: string;
}

const LABEL_MAP: Record<string, string> = {
  ador: "R",
  vitalis: "G",
  cognis: "B",
  suppress: "C",
  erode: "M",
  distort: "Y",
  void: "K",
  rgb: "RGB",
  cmyk: "CMYK",
};

export function ColorBadge({ color, children, className }: ColorBadgeProps) {
  const label = LABEL_MAP[color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        COLOR_MAP[color] || "bg-(--color-bg-elevated) text-(--color-text-secondary)",
        className
      )}
    >
      {label && <span className="font-bold opacity-60">{label}</span>}
      {children}
    </span>
  );
}
