import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GlossarySearch } from "@/components/world/GlossarySearch";
import glossary from "@/content/world/glossary.json";
import type { GlossaryEntry } from "@/types/world";
import { WorldHero } from "@/components/world/WorldHero";

export const metadata: Metadata = {
  title: "용어 사전",
  description: "크로마라 세계의 모든 확정 용어. 세계관설정집 부록 A 기준.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <WorldHero section="glossary" alt="용어 사전" />
      <SectionHeader
        title="용어 사전"
        kanji="辞典"
        description="크로마라 세계의 모든 확정 용어. 세계관설정집 부록 A 기준."
      />
      <GlossarySearch entries={glossary as GlossaryEntry[]} />
    </div>
  );
}
