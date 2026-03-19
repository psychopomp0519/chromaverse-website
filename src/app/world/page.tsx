import type { Metadata } from "next";
import { ConstellationMap } from "@/components/world/ConstellationMap";

export const metadata: Metadata = {
  title: "세계관",
  description: "크로마라 — 빛과 어둠의 세계. 렌과 묵렌이 사는 9개 지역의 이야기를 탐험하세요.",
};

export default function WorldPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-(--color-text-muted)">
          彩界
        </p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl font-(family-name:--font-heading)">
          <span className="text-gradient-rgb">크로마라</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-(--color-text-secondary)">
          노드를 클릭하면 해당 세계관 페이지로 이동합니다
        </p>
      </div>

      <ConstellationMap />
    </div>
  );
}
