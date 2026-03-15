"use client";

import { cn } from "@/lib/utils";
import { Navigation } from "./Navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="bg-glass border-t border-white/5 md:hidden">
      <div className="px-4 py-4">
        <Navigation vertical onItemClick={onClose} />
      </div>
    </div>
  );
}
