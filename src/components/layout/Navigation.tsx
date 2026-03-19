"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/world", label: "세계관" },
  { href: "/novel", label: "소설" },
  { href: "/about", label: "소개" },
];

interface NavigationProps {
  className?: string;
  vertical?: boolean;
  onItemClick?: () => void;
}

export function Navigation({ className, vertical, onItemClick }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      vertical ? "flex flex-col gap-1" : "flex items-center gap-1",
      className
    )}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-(--color-bg-elevated) text-(--color-text-primary)"
                : "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-elevated)/50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
