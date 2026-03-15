import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";

export const metadata: Metadata = {
  title: "소개",
  description: "크로마버스 프로젝트에 대하여. 확장 작품 로드맵.",
};

const ROADMAP = [
  {
    category: "단기 확장 작품",
    items: [
      { title: "불꽃의 연합", type: "소설", status: "구상 중", description: "프리즈마력 780~790년. 플린트의 엔지 연합 코드 건설기. 전쟁/정치극." },
      { title: "황혼의 외교관", type: "소설", status: "구상 중", description: "프리즈마력 780~800년. 더스크의 양측 외교 줄타기. 외교/스릴러." },
      { title: "백색의 그림자", type: "소설", status: "구상 중", description: "프리즈마력 760~800년. 적대자 블랑의 내면. 서한과 일지로 재구성. 비극/정치극." },
      { title: "금도금의 장부", type: "소설", status: "구상 중", description: "프리즈마력 770~790년. 길트의 코지 암시장 제국 건설기. 경제/느와르." },
    ],
  },
  {
    category: "장기 확장 작품",
    items: [
      { title: "혼돈기 연대기", type: "소설", status: "장기 목표", description: "프리즈마력 0~100년. 프리즈마폴 직후. 생존/문명 건설." },
      { title: "빛과 어둠의 전쟁", type: "소설", status: "장기 목표", description: "프리즈마력 520~550년. '30년 기록 소실'의 진실. 전쟁/군상극." },
      { title: "정착기 — 천년의 봄", type: "소설", status: "장기 목표", description: "프리즈마력 800~1000년. 코드 네트워크가 세계를 바꿔가는 과정. 대하역사." },
      { title: "제2차 반전", type: "소설", status: "장기 목표", description: "프리즈마력 1420년. 메이사이급 렌의 자발적 반전. 심리/사회 드라마." },
      { title: "크로마주: 프리퀄", type: "소설", status: "장기 목표", description: "프리즈마력 1490~1500년. 게임 직전 시대. 봉인 약화의 최전선. 모험/액션." },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="크로마버스 프로젝트"
        subtitle="빛과 어둠의 세계를 만들어가는 이야기"
      />

      {/* 프로젝트 소개 */}
      <section className="mb-16">
        <div className="rounded-2xl border border-white/5 bg-(--color-deep-card) p-8">
          <h2 className="text-xl font-bold mb-4">크로마버스란?</h2>
          <div className="space-y-4 text-(--color-text-secondary) leading-relaxed">
            <p>
              크로마버스는 RGB와 CMYK 색채 체계를 기반으로 한 판타지 세계관 &lsquo;크로마라&rsquo;를 배경으로 하는
              미디어 프로젝트입니다.
            </p>
            <p>
              700화의 대하소설 &lsquo;크로마버스&rsquo;를 중심으로, 세계관 백과사전, 웹 게임,
              그리고 다양한 확장 콘텐츠를 통해 하나의 세계를 여러 각도에서 경험할 수 있는 통합 플랫폼을 목표로 합니다.
            </p>
            <p>
              이 웹사이트는 세계관설정집 v2.3.3과 소설설계서 v2.3을 기반으로 구축되었습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 확장 작품 로드맵 */}
      <section>
        <h2 className="mb-8 text-2xl font-bold">확장 작품 로드맵</h2>
        {ROADMAP.map((group) => (
          <div key={group.category} className="mb-10">
            <h3 className="mb-4 text-sm font-bold text-(--color-text-muted) uppercase tracking-wider">
              {group.category}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/5 bg-(--color-deep-card) p-5 transition-colors hover:border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-(--color-text-muted)">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-(--color-text-secondary) mb-2">
                    {item.description}
                  </p>
                  <span className="text-xs text-(--color-text-muted)">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
