"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUnlockStore } from "@/stores/unlock";
import { getCompletedChapters } from "@/lib/reading";
import { createClient } from "@/lib/supabase/client";
import { UNLOCK_MAP } from "@/lib/content-unlock";

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

/** 잠긴 노드에 필요한 챕터 수를 반환 */
function getRequiredChapter(nodeId: string): number | null {
  for (const [ch, nodes] of Object.entries(UNLOCK_MAP)) {
    const mapped = nodeId === "special" ? "special-beings" : nodeId;
    if (nodes.includes(mapped)) return Number(ch);
  }
  return null;
}

export function ConstellationMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  const { unlockedNodes, isLoggedIn, setCompletedChapters, setLoggedIn } = useUnlockStore();

  // Entry animation trigger
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setLoggedIn(true);
      const chapters = await getCompletedChapters();
      setCompletedChapters(chapters);
    }
    load();
  }, [setCompletedChapters, setLoggedIn]);

  const hoveredNode = hovered ? getNode(hovered) : null;
  const connectedIds = hoveredNode ? new Set(hoveredNode.connections) : new Set<string>();

  // 기본 해제 노드 (0화 기준: creation, races, glossary)
  const baseUnlocked = UNLOCK_MAP[0] ?? [];

  function isUnlocked(nodeId: string): boolean {
    const mapped = nodeId === "special" ? "special-beings" : nodeId;
    if (!isLoggedIn) return baseUnlocked.includes(mapped);
    return unlockedNodes.includes(mapped);
  }

  const totalNodes = NODES.length;
  const unlockedCount = NODES.filter((n) => isUnlocked(n.id)).length;

  return (
    <>
      {/* 진행률 표시 */}
      <p className="mb-4 text-center text-xs text-(--color-text-muted)">
        {unlockedCount}/{totalNodes} 해제
        {!isLoggedIn && (
          <span className="ml-1">
            · <Link href="/auth/login?returnTo=/world" className="underline hover:text-(--color-text-primary)">로그인</Link>하면 소설 읽기 진행에 따라 더 많은 세계관이 열립니다
          </span>
        )}
      </p>

      {/* Desktop: SVG Map */}
      <div ref={svgRef} className="relative mx-auto hidden w-full max-w-5xl md:block" style={{ aspectRatio: "16/10" }}>
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

              const bothUnlocked = isUnlocked(node.id) && isUnlocked(targetId);
              const isHighlighted =
                bothUnlocked &&
                (hovered === node.id ||
                 hovered === targetId ||
                 (hovered && connectedIds.has(node.id) && connectedIds.has(targetId)));

              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={entered ? target.x : node.x}
                  y2={entered ? target.y : node.y}
                  stroke={isHighlighted ? node.color : "var(--color-text-muted)"}
                  strokeWidth={isHighlighted ? 0.4 : 0.2}
                  strokeOpacity={entered ? (bothUnlocked ? (isHighlighted ? 0.9 : 0.45) : 0.15) : 0}
                  style={{ transition: "all 0.8s ease" }}
                />
              );
            })
          )}

          {/* Nodes */}
          {NODES.map((node, nodeIdx) => {
            const unlocked = isUnlocked(node.id);
            const isHovered = hovered === node.id;
            const isConnected = connectedIds.has(node.id);
            const dimmed = (hovered && !isHovered && !isConnected) || !unlocked;
            const requiredCh = getRequiredChapter(node.id);

            const nodeContent = (
              <g key={node.id} style={{ opacity: entered ? 1 : 0, transition: `opacity 0.5s ease ${nodeIdx * 0.08}s` }}>
                {/* Glow circle */}
                {isHovered && unlocked && (
                  <circle cx={node.x} cy={node.y} r={4} fill={node.color} opacity={0.15} />
                )}
                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered && unlocked ? 2.2 : 1.8}
                  fill={unlocked ? node.color : "var(--color-bg-elevated)"}
                  stroke={unlocked ? "none" : "var(--color-border-hover)"}
                  strokeWidth={unlocked ? 0 : 0.2}
                  opacity={dimmed ? 0.3 : 1}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: unlocked ? "pointer" : "default",
                    transition: "all 0.3s ease",
                    filter: isHovered && unlocked ? `drop-shadow(0 0 3px ${node.color})` : "none",
                  }}
                />
                {/* Lock icon for locked nodes */}
                {!unlocked && (
                  <text
                    x={node.x}
                    y={node.y + 0.7}
                    textAnchor="middle"
                    fontSize="2"
                    fill="var(--color-text-muted)"
                    style={{ pointerEvents: "none" }}
                  >
                    🔒
                  </text>
                )}
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + (node.y < 50 ? 4.5 : -3)}
                  textAnchor="middle"
                  fontSize="2"
                  fontWeight="600"
                  fill={unlocked ? "var(--color-text-primary)" : "var(--color-text-muted)"}
                  opacity={dimmed ? 0.3 : unlocked ? 1 : 0.5}
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
                  {unlocked ? node.kanji : `${requiredCh}화 후 해제`}
                </text>
              </g>
            );

            return unlocked ? (
              <Link key={node.id} href={node.href}>{nodeContent}</Link>
            ) : (
              <g key={node.id}>{nodeContent}</g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: Vertical list */}
      <div className="space-y-2 md:hidden">
        {NODES.map((node, i) => {
          const unlocked = isUnlocked(node.id);
          const requiredCh = getRequiredChapter(node.id);

          const content = (
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                unlocked
                  ? "border-(--color-border) bg-(--color-bg-surface) hover:border-(--color-border-hover)"
                  : "border-(--color-border) bg-(--color-bg-deep) opacity-50"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: unlocked ? node.color : "var(--color-bg-elevated)" }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--color-text-primary)">
                  {node.label}
                  <span className="ml-2 text-xs font-normal text-(--color-text-muted)">
                    {unlocked ? node.kanji : `🔒 ${requiredCh}화 후 해제`}
                  </span>
                </p>
              </div>
              {unlocked && (
                <svg className="ml-auto h-4 w-4 shrink-0 text-(--color-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          );

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {unlocked ? <Link href={node.href}>{content}</Link> : content}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
