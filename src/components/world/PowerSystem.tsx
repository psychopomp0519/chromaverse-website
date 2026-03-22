"use client";

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

/* ── 대응 채널 쌍 카드 ── */
function CounterPairRow({
  rgb,
  cmyk,
  relation,
}: {
  rgb: AnyChannel;
  cmyk: AnyChannel;
  relation: { bonus: string; desc: string };
}) {
  return (
    <div className="rounded-2xl border border-(--color-border) overflow-hidden">
      {/* 상단: 대응 관계 요약 */}
      <div className="flex items-center justify-center gap-3 border-b border-(--color-border) bg-(--color-bg-elevated) px-4 py-2.5">
        <span className="text-sm font-bold" style={{ color: rgb.color }}>
          {rgb.name}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
          <span className="inline-block h-px w-4 bg-(--color-border-hover)" />
          {relation.bonus} 상쇄
          <span className="inline-block h-px w-4 bg-(--color-border-hover)" />
        </span>
        <span className="text-sm font-bold" style={{ color: cmyk.color }}>
          {cmyk.name}
        </span>
      </div>

      {/* 좌우 분할 */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* RGB 측 */}
        <div className="p-5 sm:border-r border-b sm:border-b-0 border-(--color-border)">
          <ChannelDetail channel={rgb} side="rgb" />
        </div>
        {/* CMYK 측 */}
        <div className="p-5">
          <ChannelDetail channel={cmyk} side="cmyk" />
        </div>
      </div>
    </div>
  );
}

/* ── 채널 디테일 (좌/우 공용) ── */
function ChannelDetail({ channel, side }: { channel: AnyChannel; side: "rgb" | "cmyk" }) {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-8 w-8 rounded-full shrink-0"
          style={{ backgroundColor: channel.color }}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{channel.name}</span>
            <span className="text-xs text-(--color-text-muted)">{channel.kanji}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-(--color-text-muted)">
            {side === "rgb" ? "빛" : "어둠"} · {channel.id.toUpperCase()}
          </p>
        </div>
      </div>

      {/* 능력 */}
      <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-1">
        {channel.domain}
      </p>
      <p className="text-xs text-(--color-text-muted) italic">
        {channel.physicalBasis}
      </p>

      {/* 범위 바 (RGB만) */}
      {"ranges" in channel && channel.ranges && (
        <div className="mt-3 space-y-1">
          {channel.ranges.map((range: { min: number; max: number; description: string }) => {
            const width = ((range.max - range.min) / 255) * 100;
            return (
              <div key={`${range.min}-${range.max}`} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-right text-[10px] text-(--color-text-muted) tabular-nums">
                  {range.min}~{range.max}
                </span>
                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-(--color-bg-surface)">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${CHANNEL_GRADIENT[channel.id]} opacity-60`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-32 shrink-0 text-[10px] text-(--color-text-secondary)">
                  {range.description}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 비고 */}
      {"note" in channel && typeof channel.note === "string" && (
        <p className="mt-3 rounded-lg bg-(--color-bg-surface) p-2.5 text-xs italic text-(--color-text-muted) leading-relaxed">
          {channel.note}
        </p>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export function PowerSystem() {
  // R↔C, G↔M, B↔Y 쌍 구성
  const pairs = powerData.counterRelations.map((rel) => ({
    rgb: powerData.rgb.channels.find((ch) => ch.id === rel.rgb.toLowerCase())!,
    cmyk: powerData.cmyk.channels.find((ch) => ch.id === rel.cmyk.toLowerCase())!,
    relation: rel,
  }));

  const voidChannel = powerData.cmyk.channels.find((ch) => ch.id === "k")!;

  return (
    <div className="space-y-10">
      {/* ── 섹션 1: 체계 소개 ── */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-ador/20 bg-ador/5 p-4">
          <p className="text-lg font-bold text-ador">RGB<span className="ml-1 text-xs font-normal text-(--color-text-muted)">빛</span></p>
          <p className="text-xs text-(--color-text-muted)">빛의 체계 · 루미나스</p>
          <div className="mt-2 flex justify-center gap-2">
            {powerData.rgb.channels.map((ch) => (
              <div
                key={ch.id}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ backgroundColor: ch.color }}
                title={ch.name}
              >
                {ch.id.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-suppress/20 bg-suppress/5 p-4">
          <p className="text-lg font-bold text-(--color-text-primary)">CMYK<span className="ml-1 text-xs font-normal text-(--color-text-muted)">어둠</span></p>
          <p className="text-xs text-(--color-text-muted)">어둠의 체계 · 쿠로겐</p>
          <div className="mt-2 flex justify-center gap-2">
            {powerData.cmyk.channels.map((ch) => (
              <div
                key={ch.id}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-(--color-border) text-[8px] font-bold text-white"
                style={{ backgroundColor: ch.color }}
                title={ch.name}
              >
                {ch.id.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 섹션 2: 대응 채널 쌍 ── */}
      <section>
        <h3 className="mb-1 text-lg font-bold">상쇄 대응</h3>
        <p className="mb-4 text-sm text-(--color-text-muted)">
          빛의 각 채널은 어둠의 대응 채널과 +30% 상쇄 보너스를 가집니다.
        </p>
        <div className="space-y-4">
          {pairs.map(({ rgb, cmyk, relation }) => (
            <CounterPairRow key={rgb.id} rgb={rgb} cmyk={cmyk} relation={relation} />
          ))}
        </div>
      </section>

      {/* ── 섹션 3: 보이드 (독립) ── */}
      <section>
        <h3 className="mb-1 text-lg font-bold">근원의 어둠</h3>
        <p className="mb-4 text-sm text-(--color-text-muted)">
          RGB에 대응물이 없는 유일한 채널.
        </p>
        <div className="rounded-2xl border border-void/30 bg-(--color-bg-elevated) p-6">
          <ChannelDetail channel={voidChannel} side="cmyk" />
          <p className="mt-4 rounded-lg bg-(--color-bg-surface) p-3 text-sm text-(--color-text-secondary) leading-relaxed italic border-l-2 border-void/40">
            {powerData.cmyk.hierarchy}
          </p>
        </div>
      </section>

      {/* ── 섹션 4: 혼합 능력 ── */}
      <section>
        <h3 className="mb-1 text-lg font-bold">혼합 능력</h3>
        <p className="mb-4 text-sm text-(--color-text-muted)">
          RGB 채널의 조합으로 발현되는 상위 능력.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {powerData.mixedAbilities.map((mix) => {
            const isWhite = mix.combo === "R+G+B";
            return (
              <div
                key={mix.combo}
                className={`rounded-xl border p-4 ${
                  isWhite
                    ? "border-ador/20 bg-gradient-to-br from-ador/5 via-vitalis/5 to-cognis/5 sm:col-span-2"
                    : "border-(--color-border) bg-(--color-bg-elevated)"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-full bg-(--color-bg-surface) px-2.5 py-0.5 text-xs font-bold tabular-nums">
                    {mix.combo}
                  </span>
                  <span className="font-semibold text-sm">{mix.name}</span>
                </div>
                <p className="text-sm text-(--color-text-secondary)">{mix.effect}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
