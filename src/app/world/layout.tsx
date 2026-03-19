"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WORLD_NAV = [
  { href: "/world", label: "허브", icon: "◈", exact: true },
  { href: "/world/creation", label: "창세", color: "#F1FAEE" },
  { href: "/world/races", label: "종족", color: "#34D399" },
  { href: "/world/power", label: "힘의 체계", color: "#60A5FA" },
  { href: "/world/society", label: "사회", color: "#F4A261" },
  { href: "/world/religion", label: "종교", color: "#9B5DE5" },
  { href: "/world/geography", label: "지리", color: "#43AA8B" },
  { href: "/world/history", label: "역사", color: "#577590" },
  { href: "/world/glossary", label: "용어", color: "#8B949E" },
  { href: "/world/economy", label: "경제", color: "#FF6B35" },
  { href: "/world/growth", label: "성장", color: "#00B4D8" },
  { href: "/world/chromastorm", label: "스톰", color: "#E63946" },
  { href: "/world/special-beings", label: "특수 존재", color: "#B5838D" },
];

export default function WorldLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <nav className="sticky top-16 z-30 border-b border-(--color-border) bg-(--color-bg-deep)/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 scrollbar-none">
          <div className="flex min-w-max gap-1 py-2">
            {WORLD_NAV.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    isActive
                      ? "bg-(--color-bg-elevated) text-(--color-text-primary)"
                      : "text-(--color-text-muted) hover:text-(--color-text-secondary) hover:bg-(--color-bg-surface)"
                  )}
                  style={
                    isActive && item.color
                      ? { boxShadow: `0 -2px 0 ${item.color} inset` }
                      : undefined
                  }
                >
                  {item.icon ? (
                    <span className="text-sm">{item.icon}</span>
                  ) : (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: item.color }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="w-full">{children}</div>
    </div>
  );
}
