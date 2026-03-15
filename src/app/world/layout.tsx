"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WORLD_NAV = [
  { href: "/world", label: "허브", exact: true },
  { href: "/world/creation", label: "창세" },
  { href: "/world/races", label: "종족" },
  { href: "/world/power", label: "힘의 체계" },
  { href: "/world/society", label: "사회" },
  { href: "/world/religion", label: "종교" },
  { href: "/world/geography", label: "지리" },
  { href: "/world/history", label: "역사" },
  { href: "/world/glossary", label: "용어 사전" },
  { href: "/world/economy", label: "경제" },
  { href: "/world/growth", label: "성장" },
  { href: "/world/chromastorm", label: "크로마스톰" },
  { href: "/world/special-beings", label: "특수 존재" },
];

export default function WorldLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 overflow-y-auto border-r border-white/5 bg-(--color-deep)/95 backdrop-blur-sm p-4">
        <p className="mb-3 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">
          세계관
        </p>
        <nav className="space-y-0.5">
          {WORLD_NAV.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-(--color-deep-card) text-(--color-text-primary) font-medium"
                    : "text-(--color-text-muted) hover:text-(--color-text-secondary) hover:bg-white/[0.03]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content - offset on desktop */}
      <div className="w-full lg:pl-56">
        {children}
      </div>
    </div>
  );
}
