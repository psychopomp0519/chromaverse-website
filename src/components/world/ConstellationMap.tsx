"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ConstellationNode {
  id: string;
  label: string;
  kanji: string;
  x: number;
  y: number;
  color: string;
  href: string;
  connections: string[];
}

const NODES: ConstellationNode[] = [
  { id: "creation", label: "창세", kanji: "大散光", x: 50, y: 6, color: "#D4A843", href: "/world/creation", connections: ["races", "power"] },
  { id: "races", label: "종족", kanji: "煉·墨煉", x: 25, y: 22, color: "#34D399", href: "/world/races", connections: ["creation", "society", "power"] },
  { id: "power", label: "힘의 체계", kanji: "RGB·CMYK", x: 75, y: 22, color: "#60A5FA", href: "/world/power", connections: ["creation", "races", "growth"] },
  { id: "society", label: "사회", kanji: "和音", x: 20, y: 40, color: "#F4A261", href: "/world/society", connections: ["races", "religion", "economy"] },
  { id: "religion", label: "종교", kanji: "三派", x: 80, y: 40, color: "#9B5DE5", href: "/world/religion", connections: ["society", "history"] },
  { id: "geography", label: "지리", kanji: "彩界", x: 15, y: 58, color: "#43AA8B", href: "/world/geography", connections: ["society", "economy"] },
  { id: "history", label: "역사", kanji: "年表", x: 85, y: 58, color: "#577590", href: "/world/history", connections: ["religion", "growth"] },
  { id: "economy", label: "경제", kanji: "共鳴石", x: 25, y: 74, color: "#FF6B35", href: "/world/economy", connections: ["geography", "society"] },
  { id: "growth", label: "성장", kanji: "彩度", x: 75, y: 74, color: "#00B4D8", href: "/world/growth", connections: ["power", "history"] },
  { id: "glossary", label: "용어 사전", kanji: "辞典", x: 35, y: 90, color: "#8B949E", href: "/world/glossary", connections: ["economy"] },
  { id: "chromastorm", label: "크로마스톰", kanji: "色彩嵐", x: 50, y: 88, color: "#E63946", href: "/world/chromastorm", connections: ["growth", "special"] },
  { id: "special", label: "특수 존재", kanji: "潜在顕現", x: 65, y: 92, color: "#B5838D", href: "/world/special-beings", connections: ["chromastorm"] },
];

function getNode(id: string) {
  return NODES.find((n) => n.id === id);
}

export function ConstellationMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredNode = hovered ? getNode(hovered) : null;
  const connectedIds = hoveredNode ? new Set(hoveredNode.connections) : new Set<string>();

  return (
    <>
      {/* Desktop: SVG Map */}
      <div className="relative mx-auto hidden w-full max-w-5xl md:block" style={{ aspectRatio: "16/10" }}>
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {NODES.flatMap((node) =>
            node.connections.map((targetId) => {
              const target = getNode(targetId);
              if (!target || node.id > targetId) return null;

              const isHighlighted =
                hovered === node.id ||
                hovered === targetId ||
                (hovered && connectedIds.has(node.id) && connectedIds.has(targetId));

              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? node.color : "var(--color-border)"}
                  strokeWidth={isHighlighted ? 0.3 : 0.15}
                  strokeOpacity={isHighlighted ? 0.8 : 0.3}
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })
          )}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const isHovered = hovered === node.id;
            const isConnected = connectedIds.has(node.id);
            const dimmed = hovered && !isHovered && !isConnected;

            return (
              <g key={node.id}>
                {/* Glow circle */}
                {isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={4}
                    fill={node.color}
                    opacity={0.15}
                  />
                )}
                {/* Main circle */}
                <Link href={node.href}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 2.2 : 1.8}
                    fill={node.color}
                    opacity={dimmed ? 0.3 : 1}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      filter: isHovered ? `drop-shadow(0 0 3px ${node.color})` : "none",
                    }}
                  />
                </Link>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + (node.y < 50 ? 4.5 : -3)}
                  textAnchor="middle"
                  fontSize="2"
                  fontWeight="600"
                  fill="var(--color-text-primary)"
                  opacity={dimmed ? 0.3 : 1}
                  style={{ transition: "opacity 0.3s", pointerEvents: "none" }}
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + (node.y < 50 ? 6.5 : -1)}
                  textAnchor="middle"
                  fontSize="1.3"
                  fill="var(--color-text-muted)"
                  opacity={dimmed ? 0.2 : 0.6}
                  style={{ transition: "opacity 0.3s", pointerEvents: "none" }}
                >
                  {node.kanji}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: Vertical list */}
      <div className="space-y-2 md:hidden">
        {NODES.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={node.href}
              className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg-surface) p-4 transition-all hover:border-(--color-border-hover)"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: node.color }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--color-text-primary)">
                  {node.label}
                  <span className="ml-2 text-xs font-normal text-(--color-text-muted)">
                    {node.kanji}
                  </span>
                </p>
              </div>
              <svg className="ml-auto h-4 w-4 shrink-0 text-(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
