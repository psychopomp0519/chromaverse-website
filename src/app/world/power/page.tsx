import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PowerSystem } from "@/components/world/PowerSystem";
import { ChromaSimulator } from "@/components/world/ChromaSimulator";
import { WorldHero } from "@/components/world/WorldHero";

export const metadata: Metadata = {
  title: "힘의 체계 — RGB · CMYK",
  description: "빛과 어둠의 7개 채널. 각 채널의 능력, 수치 구간, 혼합 능력과 상쇄 관계.",
};

export default function PowerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <WorldHero section="power" alt="힘의 체계" />
      <SectionHeader
        title="힘의 체계"
        kanji="RGB · CMYK"
        description="빛과 어둠의 7개 채널. 각 채널의 능력, 수치 구간, 혼합 능력과 상쇄 관계."
      />

      <PowerSystem />

      {/* 크로마 시뮬레이터 */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-bold">크로마 시뮬레이터</h2>
        <p className="mb-6 text-sm text-(--color-text-secondary)">
          R/G/B 슬라이더를 조절하여 계층, 능력, 혼합 능력을 체험해보세요.
        </p>
        <ChromaSimulator />
      </section>
    </div>
  );
}
