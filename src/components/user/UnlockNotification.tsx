"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { NODE_LABELS } from "@/lib/content-unlock";

interface UnlockNotificationProps {
  nodes: string[];
  visible: boolean;
  onDismiss: () => void;
}

export function UnlockNotification({ nodes, visible, onDismiss }: UnlockNotificationProps) {
  if (nodes.length === 0) return null;

  const labels = nodes.map((n) => NODE_LABELS[n] || n).join(", ");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-3 rounded-xl border border-(--color-accent-primary)/30 bg-(--color-bg-surface) px-5 py-3 shadow-lg glow-accent">
            <span className="text-lg">🔓</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-(--color-text-primary)">
                세계관 정보가 해제되었습니다!
              </p>
              <p className="text-xs text-(--color-text-muted)">
                {labels}
              </p>
            </div>
            <Link
              href="/world"
              className="shrink-0 rounded-lg bg-(--color-accent-primary)/10 px-3 py-1 text-xs font-medium text-(--color-accent-primary) transition-colors hover:bg-(--color-accent-primary)/20"
              onClick={onDismiss}
            >
              확인
            </Link>
            <button
              onClick={onDismiss}
              className="shrink-0 text-(--color-text-muted) hover:text-(--color-text-secondary)"
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
