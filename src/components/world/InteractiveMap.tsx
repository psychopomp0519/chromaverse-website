"use client";

import { useState } from "react";
import type { WorldRegion } from "@/types/world";
import regions from "@/content/world/geography.json";
import { RegionDetail } from "./RegionDetail";

const REGION_MAP: Record<string, WorldRegion> = {};
for (const r of regions) {
  REGION_MAP[r.id] = r as WorldRegion;
}

/* ── SVG layout constants ── */
const CX = 300;
const CY = 300;
const SIZE = 600;

// Radii for concentric rings
const R_CENTER = 60;
const R_PRIMARY_INNER = 75;
const R_PRIMARY_OUTER = 145;
const R_BLEND_INNER = 155;
const R_BLEND_OUTER = 215;
const R_BORDER_INNER = 225;
const R_BORDER_OUTER = 265;
const R_DEEP = 295;

/* ── Helper to build arc‑segment paths ── */
function arcSegmentPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngleDeg: number,
  endAngleDeg: number
): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const s = toRad(startAngleDeg);
  const e = toRad(endAngleDeg);
  const sweep = endAngleDeg - startAngleDeg;
  const largeArc = sweep > 180 ? 1 : 0;

  const x1o = cx + rOuter * Math.cos(s);
  const y1o = cy + rOuter * Math.sin(s);
  const x2o = cx + rOuter * Math.cos(e);
  const y2o = cy + rOuter * Math.sin(e);
  const x1i = cx + rInner * Math.cos(e);
  const y1i = cy + rInner * Math.sin(e);
  const x2i = cx + rInner * Math.cos(s);
  const y2i = cy + rInner * Math.sin(s);

  return [
    `M ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2i} ${y2i}`,
    "Z",
  ].join(" ");
}

/* ── Segment definitions ── */
// Primary: 3 segments at 120 degrees each
// Enji (R) top-right, Seiji (G) bottom, Meichi (B) top-left
const PRIMARY_SEGMENTS: { id: string; startAngle: number; endAngle: number }[] = [
  { id: "enji", startAngle: 0, endAngle: 120 },
  { id: "seiji", startAngle: 120, endAngle: 240 },
  { id: "meichi", startAngle: 240, endAngle: 360 },
];

// Blend: positioned between the primaries they mix
// Koji (R+G) between Enji & Seiji, Aochi (G+B) between Seiji & Meichi, Shiji (R+B) between Meichi & Enji
const BLEND_SEGMENTS: { id: string; startAngle: number; endAngle: number }[] = [
  { id: "koji", startAngle: 60, endAngle: 180 },
  { id: "aochi", startAngle: 180, endAngle: 300 },
  { id: "shiji", startAngle: 300, endAngle: 420 },
];

/* ── Label positions ── */
function midpointOnArc(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number
): { x: number; y: number } {
  const mid = ((startAngleDeg + endAngleDeg) / 2 - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(mid), y: cy + r * Math.sin(mid) };
}

interface MapRegionProps {
  id: string;
  path: string;
  color: string;
  selected: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function MapRegion({ id, path, color, selected, hovered, onHover, onSelect }: MapRegionProps) {
  return (
    <path
      d={path}
      fill={color}
      fillOpacity={selected ? 0.95 : hovered ? 0.85 : 0.6}
      stroke={selected ? "#FFFFFF" : hovered ? "#FFFFFF99" : "#FFFFFF22"}
      strokeWidth={selected ? 2 : 1}
      className="cursor-pointer transition-all duration-200"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(id)}
    />
  );
}

export function InteractiveMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredRegion = hoveredId ? REGION_MAP[hoveredId] : null;
  const selectedRegion = selectedId ? REGION_MAP[selectedId] : null;

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mb-16">
      <div className="mx-auto max-w-lg">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full"
          aria-label="크로마라 인터랙티브 맵"
        >
          {/* The Deep - background circle */}
          <circle
            cx={CX}
            cy={CY}
            r={R_DEEP}
            fill={REGION_MAP.thedeep.color}
            fillOpacity={selectedId === "thedeep" ? 0.95 : hoveredId === "thedeep" ? 0.85 : 0.8}
            stroke={selectedId === "thedeep" ? "#FFFFFF" : hoveredId === "thedeep" ? "#FFFFFF99" : "#FFFFFF11"}
            strokeWidth={selectedId === "thedeep" ? 2 : 1}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredId("thedeep")}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelect("thedeep")}
          />

          {/* Border ring */}
          <MapRegion
            id="border"
            path={arcSegmentPath(CX, CY, R_BORDER_INNER, R_BORDER_OUTER, 0, 360)}
            color={REGION_MAP.border.color}
            selected={selectedId === "border"}
            hovered={hoveredId === "border"}
            onHover={setHoveredId}
            onSelect={handleSelect}
          />

          {/* Blend segments */}
          {BLEND_SEGMENTS.map((seg) => (
            <MapRegion
              key={seg.id}
              id={seg.id}
              path={arcSegmentPath(CX, CY, R_BLEND_INNER, R_BLEND_OUTER, seg.startAngle, seg.endAngle)}
              color={REGION_MAP[seg.id].color}
              selected={selectedId === seg.id}
              hovered={hoveredId === seg.id}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          ))}

          {/* Primary segments */}
          {PRIMARY_SEGMENTS.map((seg) => (
            <MapRegion
              key={seg.id}
              id={seg.id}
              path={arcSegmentPath(CX, CY, R_PRIMARY_INNER, R_PRIMARY_OUTER, seg.startAngle, seg.endAngle)}
              color={REGION_MAP[seg.id].color}
              selected={selectedId === seg.id}
              hovered={hoveredId === seg.id}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          ))}

          {/* Center - Hakuten */}
          <circle
            cx={CX}
            cy={CY}
            r={R_CENTER}
            fill={REGION_MAP.hakuten.color}
            fillOpacity={selectedId === "hakuten" ? 0.95 : hoveredId === "hakuten" ? 0.9 : 0.75}
            stroke={selectedId === "hakuten" ? "#FFFFFF" : hoveredId === "hakuten" ? "#FFFFFF99" : "#FFFFFF33"}
            strokeWidth={selectedId === "hakuten" ? 2 : 1}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredId("hakuten")}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelect("hakuten")}
          />

          {/* ── Labels ── */}
          {/* Hakuten center label */}
          <text x={CX} y={CY - 6} textAnchor="middle" className="fill-black text-[11px] font-bold pointer-events-none select-none">
            하쿠텐
          </text>
          <text x={CX} y={CY + 10} textAnchor="middle" className="fill-black/60 text-[9px] pointer-events-none select-none">
            白点
          </text>

          {/* Primary labels */}
          {PRIMARY_SEGMENTS.map((seg) => {
            const r = REGION_MAP[seg.id];
            const pos = midpointOnArc(CX, CY, (R_PRIMARY_INNER + R_PRIMARY_OUTER) / 2, seg.startAngle, seg.endAngle);
            return (
              <g key={seg.id} className="pointer-events-none select-none">
                <text x={pos.x} y={pos.y - 4} textAnchor="middle" className="fill-white text-[10px] font-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {r.name}
                </text>
                <text x={pos.x} y={pos.y + 9} textAnchor="middle" className="fill-white/70 text-[8px]" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {r.kanji}
                </text>
              </g>
            );
          })}

          {/* Blend labels */}
          {BLEND_SEGMENTS.map((seg) => {
            const r = REGION_MAP[seg.id];
            const pos = midpointOnArc(CX, CY, (R_BLEND_INNER + R_BLEND_OUTER) / 2, seg.startAngle, seg.endAngle);
            return (
              <g key={seg.id} className="pointer-events-none select-none">
                <text x={pos.x} y={pos.y - 4} textAnchor="middle" className="fill-white text-[10px] font-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {r.name}
                </text>
                <text x={pos.x} y={pos.y + 9} textAnchor="middle" className="fill-white/70 text-[8px]" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {r.kanji}
                </text>
              </g>
            );
          })}

          {/* Border label */}
          {(() => {
            const pos = midpointOnArc(CX, CY, (R_BORDER_INNER + R_BORDER_OUTER) / 2, 30, 30);
            return (
              <text x={pos.x} y={pos.y} textAnchor="middle" className="fill-white/80 text-[9px] font-bold pointer-events-none select-none" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                보더
              </text>
            );
          })()}

          {/* The Deep label */}
          {(() => {
            const pos = midpointOnArc(CX, CY, (R_BORDER_OUTER + R_DEEP) / 2, 30, 30);
            return (
              <text x={pos.x} y={pos.y} textAnchor="middle" className="fill-white/50 text-[9px] font-bold pointer-events-none select-none">
                더 딥
              </text>
            );
          })()}
        </svg>

        {/* Hover tooltip */}
        {hoveredRegion && !selectedRegion && (
          <div className="mt-4 rounded-xl border border-white/10 bg-(--color-deep-card) px-4 py-3 text-center transition-all">
            <div className="flex items-center justify-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hoveredRegion.color }} />
              <span className="font-bold">{hoveredRegion.name}</span>
              <span className="text-xs text-(--color-text-muted)">{hoveredRegion.kanji}</span>
            </div>
            <p className="mt-1 text-sm text-(--color-text-secondary)">{hoveredRegion.description}</p>
          </div>
        )}
      </div>

      {/* Selected region detail */}
      {selectedRegion && (
        <RegionDetail
          region={selectedRegion}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
