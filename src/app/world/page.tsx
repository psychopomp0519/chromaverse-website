import type { Metadata } from "next";
import { WorldUnlockStatus } from "@/components/world/WorldUnlockStatus";
import { WorldGrid } from "@/components/world/WorldGrid";

export const metadata: Metadata = {
  title: "세계관",
  description: "크로마라 — 빛과 어둠의 세계. 렌과 묵렌이 사는 9개 지역의 이야기를 탐험하세요.",
};

const WORLD_SECTIONS = [
  {
    href: "/world/creation",
    title: "창세 신화",
    kanji: "大散光",
    description: "루미나스와 쿠로겐, 그리고 프리즈마폴",
    color: "from-hakuten/20 to-void/20",
    accent: "group-hover:border-hakuten/30",
  },
  {
    href: "/world/races",
    title: "종족",
    kanji: "煉 · 墨煉",
    description: "렌, 묵렌, 이로쥬, 보쿠쥬",
    color: "from-ador/20 to-suppress/20",
    accent: "group-hover:border-ador/30",
  },
  {
    href: "/world/power",
    title: "힘의 체계",
    kanji: "RGB · CMYK",
    description: "7개 채널의 능력과 상쇄 관계",
    color: "from-ador/20 via-vitalis/20 to-cognis/20",
    accent: "group-hover:border-vitalis/30",
  },
  {
    href: "/world/society",
    title: "사회 · 코드",
    kanji: "和音",
    description: "색채 계층과 코드 체계",
    color: "from-koji/20 to-meichi/20",
    accent: "group-hover:border-koji/30",
  },
  {
    href: "/world/religion",
    title: "종교",
    kanji: "三派",
    description: "광명회, 심묵교, 균형파",
    color: "from-hakuten/20 via-border/20 to-void/20",
    accent: "group-hover:border-border/30",
  },
  {
    href: "/world/geography",
    title: "지리",
    kanji: "彩界",
    description: "크로마라의 9개 지역",
    color: "from-enji/20 via-seiji/20 to-aochi/20",
    accent: "group-hover:border-seiji/30",
  },
  {
    href: "/world/history",
    title: "역사",
    kanji: "年表",
    description: "프리즈마력 0년부터 1500년까지",
    color: "from-cognis/20 to-shiji/20",
    accent: "group-hover:border-cognis/30",
  },
  {
    href: "/world/glossary",
    title: "용어 사전",
    kanji: "辞典",
    description: "크로마라 세계의 모든 용어",
    color: "from-aochi/20 to-vitalis/20",
    accent: "group-hover:border-aochi/30",
  },
  {
    href: "/world/economy",
    title: "경제",
    kanji: "共鳴石",
    description: "레스 체계와 크로마튜너",
    color: "from-koji/20 to-enji/20",
    accent: "group-hover:border-koji/30",
  },
  {
    href: "/world/growth",
    title: "성장 체계",
    kanji: "彩度 · 分光",
    description: "사이도, 스플릿, 반전, 산포",
    color: "from-vitalis/20 to-shiji/20",
    accent: "group-hover:border-shiji/30",
  },
  {
    href: "/world/chromastorm",
    title: "크로마스톰",
    kanji: "色彩嵐",
    description: "색채 에너지 폭풍의 원리와 영향",
    color: "from-ador/20 to-suppress/20",
    accent: "group-hover:border-ador/30",
  },
  {
    href: "/world/special-beings",
    title: "특수 존재",
    kanji: "潜在顕現",
    description: "잠재 현현, 반전, 경계의 존재들",
    color: "from-shiji/20 to-border/20",
    accent: "group-hover:border-shiji/30",
  },
];

export default function WorldPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-(--color-text-muted)">
          彩界
        </p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl md:text-6xl font-(family-name:--font-heading)">
          <span className="text-gradient-rgb">크로마라</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-(--color-text-secondary)">
          빛의 근원 루미나스에서 태어난 세계.
          <br />
          렌과 묵렌, RGB와 CMYK, 9개 지역의 이야기.
        </p>
      </div>

      <WorldUnlockStatus />

      <WorldGrid sections={WORLD_SECTIONS} />
    </div>
  );
}
