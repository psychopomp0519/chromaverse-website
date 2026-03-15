"use client";

import type { WorldRegion } from "@/types/world";

interface RegionDetailProps {
  region: WorldRegion;
  onClose: () => void;
}

export function RegionDetail({ region, onClose }: RegionDetailProps) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-(--color-deep-card) p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="mt-1 h-14 w-14 shrink-0 rounded-xl"
            style={{ backgroundColor: region.color }}
          />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">{region.name}</h3>
              <span className="text-sm text-(--color-text-muted)">{region.kanji}</span>
            </div>
            <p className="mt-1 text-(--color-text-secondary)">{region.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg p-2 text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text-primary)"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="mt-6 space-y-4">
        <p className="leading-relaxed text-(--color-text-secondary)">{region.characteristics}</p>

        <div className="flex flex-wrap gap-2">
          {region.dominantChannel && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: region.color + "1A",
                color: region.color,
                border: `1px solid ${region.color}33`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: region.color }} />
              {region.dominantChannel}
            </span>
          )}
          {region.saturationRange && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-(--color-text-muted) border border-white/10">
              채도 {region.saturationRange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
