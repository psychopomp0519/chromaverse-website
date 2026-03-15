import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Timeline } from "@/components/world/Timeline";
import events from "@/content/world/history.json";

export const metadata: Metadata = {
  title: "역사 — 프리즈마력 연표",
  description: "프리즈마력 0년 프리즈마폴부터 1500년 현재까지. 크로마라 1500년의 역사.",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="역사 연표"
        kanji="年表"
        subtitle="프리즈마력 0 ~ 1500년"
        description="프리즈마폴로 시작된 세계의 역사. ★ 표시는 소설에서 상세히 다룰 사건."
      />
      <Timeline events={events} />
    </div>
  );
}
