"use client";

import { useState, useMemo } from "react";

const RGB_TIERS = [
  { name: "보쿠에이", kanji: "墨影", min: 0, max: 99 },
  { name: "탄사이", kanji: "淡彩", min: 100, max: 299 },
  { name: "츄사이", kanji: "中彩", min: 300, max: 549 },
  { name: "메이사이", kanji: "明彩", min: 550, max: 699 },
  { name: "키하쿠", kanji: "輝白", min: 700, max: 765 },
];

const CHANNEL_ABILITIES: Record<string, { name: string; ranges: { max: number; desc: string }[] }> = {
  r: {
    name: "아도르 (熱)",
    ranges: [
      { max: 50, desc: "물리 허약, 열 감지만" },
      { max: 120, desc: "일반인 물리, 미약한 열 조작" },
      { max: 200, desc: "강화 신체, 열 방출 및 흡수" },
      { max: 240, desc: "초인적 물리, 물질 상태 변환" },
      { max: 255, desc: "분자 단위 조작, 플라즈마" },
    ],
  },
  g: {
    name: "비탈리스 (生)",
    ranges: [
      { max: 50, desc: "허약한 체질, 질병 취약" },
      { max: 120, desc: "보통 건강, 가벼운 자가치유" },
      { max: 200, desc: "타인 치유, 동식물 교감" },
      { max: 240, desc: "중상 치유, 독 정화, 부분 변형" },
      { max: 255, desc: "사지 재생, 생명체 창조급" },
    ],
  },
  b: {
    name: "코그니스 (識)",
    ranges: [
      { max: 50, desc: "인지 저하, 감응 불가" },
      { max: 120, desc: "보통 지능, 직감적 위험감지" },
      { max: 200, desc: "강화 분석력, 파동 조작" },
      { max: 240, desc: "초고속 사고, 정신 간섭" },
      { max: 255, desc: "공간 왜곡급 파동, 완전 정신간섭" },
    ],
  },
};

const MIXED_ABILITIES = [
  { combo: "R+G", name: "옐로 퓨전", threshold: 120 },
  { combo: "R+B", name: "마젠타 퓨전", threshold: 120 },
  { combo: "G+B", name: "시안 퓨전", threshold: 120 },
  { combo: "R+G+B", name: "화이트 컨버전스", threshold: 200 },
];

function getAbility(channel: string, value: number) {
  const ch = CHANNEL_ABILITIES[channel];
  if (!ch) return "";
  for (const range of ch.ranges) {
    if (value <= range.max) return range.desc;
  }
  return ch.ranges[ch.ranges.length - 1].desc;
}

function getTier(total: number) {
  for (const tier of RGB_TIERS) {
    if (total >= tier.min && total <= tier.max) return tier;
  }
  return RGB_TIERS[0];
}

const CHANNEL_COLORS = { r: "#E63946", g: "#2D6A4F", b: "#457B9D" };

export function ChromaSimulator() {
  const [r, setR] = useState(85);
  const [g, setG] = useState(72);
  const [b, setB] = useState(88);

  const total = r + g + b;
  const tier = useMemo(() => getTier(total), [total]);

  const mixedAbilities = useMemo(() => {
    return MIXED_ABILITIES.filter((mix) => {
      if (mix.combo === "R+G") return r >= mix.threshold && g >= mix.threshold;
      if (mix.combo === "R+B") return r >= mix.threshold && b >= mix.threshold;
      if (mix.combo === "G+B") return g >= mix.threshold && b >= mix.threshold;
      if (mix.combo === "R+G+B") return r >= mix.threshold && g >= mix.threshold && b >= mix.threshold;
      return false;
    });
  }, [r, g, b]);

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-bg-elevated) p-6">
      <h3 className="text-lg font-bold mb-6">크로마 시뮬레이터</h3>

      {/* Color Preview */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className="h-20 w-20 rounded-2xl border border-(--color-border-hover) shadow-lg"
          style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
        />
        <div>
          <p className="text-2xl font-bold tabular-nums">
            총합 {total}
          </p>
          <p className="text-sm text-(--color-text-secondary)">
            {tier.name} <span className="text-(--color-text-muted)">{tier.kanji}</span>
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-6">
        {[
          { key: "r" as const, label: "R", value: r, set: setR, info: CHANNEL_ABILITIES.r },
          { key: "g" as const, label: "G", value: g, set: setG, info: CHANNEL_ABILITIES.g },
          { key: "b" as const, label: "B", value: b, set: setB, info: CHANNEL_ABILITIES.b },
        ].map((ch) => (
          <div key={ch.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold" style={{ color: CHANNEL_COLORS[ch.key] }}>
                {ch.label} — {ch.info.name}
              </span>
              <span className="text-sm tabular-nums text-(--color-text-muted)">{ch.value}</span>
            </div>
            <input
              type="range"
              min={0}
              max={255}
              value={ch.value}
              onChange={(e) => ch.set(Number(e.target.value))}
              className="w-full accent-current"
              style={{ color: CHANNEL_COLORS[ch.key] }}
            />
            <p className="mt-1 text-xs text-(--color-text-muted)">
              {getAbility(ch.key, ch.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Mixed Abilities */}
      {mixedAbilities.length > 0 && (
        <div className="border-t border-(--color-border) pt-4">
          <p className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-2">
            혼합 능력 발현
          </p>
          <div className="flex flex-wrap gap-2">
            {mixedAbilities.map((mix) => (
              <span
                key={mix.combo}
                className="rounded-full bg-(--color-bg-elevated) px-3 py-1 text-xs font-medium"
              >
                {mix.combo} {mix.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
