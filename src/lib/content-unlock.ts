/**
 * 소설 읽기 진행률 → 세계관 콘텐츠 해제 매핑
 * N화 완독 시 어떤 세계관 섹션이 열리는지 정의
 */

export const UNLOCK_MAP: Record<number, string[]> = {
  0:  ["creation", "races", "glossary"],       // 기본 해제 (읽기 전)
  1:  ["power", "society"],                     // 1화 완독
  3:  ["religion", "geography"],                // 3화 완독
  5:  ["chromastorm", "economy"],               // 5화 완독
  7:  ["growth", "history"],                    // 7화 완독
  10: ["special-beings"],                       // 10화 완독
};

export const ALL_WORLD_NODES = [
  "creation", "races", "power", "society", "religion",
  "geography", "history", "glossary", "economy", "growth",
  "chromastorm", "special-beings",
];

export function getUnlockedNodes(completedChapters: number[]): string[] {
  const maxCompleted = completedChapters.length > 0
    ? Math.max(...completedChapters)
    : 0;
  const unlocked = new Set<string>();
  for (const [chapter, nodes] of Object.entries(UNLOCK_MAP)) {
    if (Number(chapter) <= maxCompleted) {
      nodes.forEach((n) => unlocked.add(n));
    }
  }
  return Array.from(unlocked);
}

export function getNextUnlock(completedChapters: number[]): {
  chapter: number;
  nodes: string[];
} | null {
  const maxCompleted = completedChapters.length > 0
    ? Math.max(...completedChapters)
    : 0;
  const sortedChapters = Object.keys(UNLOCK_MAP)
    .map(Number)
    .sort((a, b) => a - b);
  const next = sortedChapters.find((ch) => ch > maxCompleted);
  if (next === undefined) return null;
  return { chapter: next, nodes: UNLOCK_MAP[next] };
}

/** 노드 ID → 한글 라벨 */
export const NODE_LABELS: Record<string, string> = {
  creation: "창세",
  races: "종족",
  power: "힘의 체계",
  society: "사회",
  religion: "종교",
  geography: "지리",
  history: "역사",
  glossary: "용어 사전",
  economy: "경제",
  growth: "성장",
  chromastorm: "크로마스톰",
  "special-beings": "특수 존재",
};
