import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ReligionCompare } from "@/components/world/ReligionCompare";
import religions from "@/content/world/religion.json";
import { WorldHero } from "@/components/world/WorldHero";

export const metadata: Metadata = {
  title: "종교 — 삼파 대립",
  description: "광명회, 심묵교, 균형파. 빛과 어둠을 바라보는 세 가지 시선.",
};

export default function ReligionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <WorldHero section="religion" alt="종교" />
      <SectionHeader
        title="종교 — 삼파 대립"
        kanji="三派"
        description="프리즈마폴과 쿠로겐을 둘러싼 세 종파의 해석. 빛을 숭배하는 자, 어둠을 숭배하는 자, 균형을 추구하는 자."
      />
      <ReligionCompare religions={religions} />
    </div>
  );
}
