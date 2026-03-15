"use client";

import { useState } from "react";
import powerData from "@/content/world/power.json";

const CHANNEL_GRADIENT: Record<string, string> = {
  r: "from-ador to-ador-dark",
  g: "from-vitalis to-vitalis-dark",
  b: "from-cognis to-cognis-dark",
  c: "from-suppress to-suppress-dark",
  m: "from-erode to-erode-dark",
  y: "from-distort to-distort-dark",
  k: "from-void to-void",
};

type AnyChannel = (typeof powerData.rgb.channels)[0] | (typeof powerData.cmyk.channels)[0];

function ChannelCard({ channel }: { channel: AnyChannel }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-(--color-deep-card) p-6 transition-colors hover:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full" style={{ backgroundColor: channel.color }} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{channel.name}</span>
            <span className="text-xs text-(--color-text-muted)">{channel.kanji}</span>
          </div>
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
            {channel.id.toUpperCase()} 채널
          </p>
        </div>
      </div>

      <p className="text-sm text-(--color-text-secondary) mb-2">
        <span className="font-medium text-(--color-text-primary)">능력: </span>
        {channel.domain}
      </p>
      <p className="text-sm text-(--color-text-secondary) mb-4">
        <span className="font-medium text-(--color-text-primary)">근거: </span>
        {channel.physicalBasis}
      </p>

      {"ranges" in channel && channel.ranges && (
        <div className="space-y-1.5">
          {channel.ranges.map((range: { min: number; max: number; description: string }) => {
            const width = ((range.max - range.min) / 255) * 100;
            return (
              <div key={`${range.min}-${range.max}`} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-right text-xs text-(--color-text-muted) tabular-nums">
                  {range.min}~{range.max}
                </span>
                <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${CHANNEL_GRADIENT[channel.id]} opacity-60`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-48 shrink-0 text-xs text-(--color-text-secondary)">
                  {range.description}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {channel.counterpart && (
        <p className="mt-3 text-xs text-(--color-text-muted)">
          상쇄 대상: {channel.counterpart.toUpperCase()} (+30%)
        </p>
      )}

      {"note" in channel && typeof channel.note === "string" && (
        <p className="mt-3 rounded-lg bg-white/[0.03] p-3 text-sm italic text-(--color-text-muted)">
          {channel.note}
        </p>
      )}
    </div>
  );
}

export function PowerSystem() {
  const [activeTab, setActiveTab] = useState<"rgb" | "cmyk" | "mixed">("rgb");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8 flex gap-1 rounded-xl bg-(--color-deep-card) p-1">
        {[
          { key: "rgb" as const, label: "RGB — 빛의 체계" },
          { key: "cmyk" as const, label: "CMYK — 어둠의 체계" },
          { key: "mixed" as const, label: "혼합 · 상쇄" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white/10 text-(--color-text-primary)"
                : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "rgb" && (
        <div className="space-y-6">
          {powerData.rgb.channels.map((ch) => (
            <ChannelCard key={ch.id} channel={ch} />
          ))}
        </div>
      )}

      {activeTab === "cmyk" && (
        <div className="space-y-6">
          {powerData.cmyk.channels.map((ch) => (
            <ChannelCard key={ch.id} channel={ch} />
          ))}
          <p className="rounded-xl bg-white/[0.03] p-4 text-sm text-(--color-text-muted) leading-relaxed italic">
            {powerData.cmyk.hierarchy}
          </p>
        </div>
      )}

      {activeTab === "mixed" && (
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-bold">혼합 능력</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {powerData.mixedAbilities.map((mix) => (
                <div key={mix.combo} className="rounded-xl border border-white/5 bg-(--color-deep-card) p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold">{mix.combo}</span>
                    <span className="font-semibold">{mix.name}</span>
                  </div>
                  <p className="text-sm text-(--color-text-secondary)">{mix.effect}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">상쇄 관계</h3>
            <div className="space-y-3">
              {powerData.counterRelations.map((rel) => (
                <div key={rel.rgb} className="flex items-center gap-4 rounded-xl border border-white/5 bg-(--color-deep-card) p-4">
                  <span className="rounded-full bg-ador/10 px-3 py-1 text-sm font-bold text-ador-light">{rel.rgb}</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-(--color-text-muted)">{rel.bonus}</span>
                    <span className="text-(--color-text-muted)">&harr;</span>
                  </div>
                  <span className="rounded-full bg-suppress/10 px-3 py-1 text-sm font-bold text-suppress-light">{rel.cmyk}</span>
                  <span className="text-sm text-(--color-text-secondary)">{rel.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
