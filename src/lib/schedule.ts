import scheduleData from "@/content/novel/release-schedule.json";

/* ---------- types ---------- */

export interface ChapterStatus {
  chapter: number;
  released: boolean;
  releaseDate: Date | null;
  isNew: boolean;
}

export interface NextRelease {
  chapter: number;
  releaseDate: Date;
  daysLeft: number;
  hoursLeft: number;
}

/* ---------- core: 공개일 계산 ---------- */

const DAY_MS = 24 * 60 * 60 * 1000;
const NEW_THRESHOLD_MS = 3 * DAY_MS;

/** batch 목록을 chapter → Date 맵으로 캐싱 */
const batchMap = new Map<number, Date>();
for (const b of scheduleData.batch) {
  const d = new Date(b.releaseDate);
  for (const ch of b.chapters) {
    batchMap.set(ch, d);
  }
}

const { startChapter, startDate, intervalDays } = scheduleData.recurring;
const recurringStart = new Date(startDate);

/**
 * 임의의 화수에 대해 공개일을 반환.
 * - batch에 명시된 화 → batch 공개일
 * - 그 외 → recurring 규칙으로 계산
 */
export function getReleaseDate(chapter: number): Date {
  const batched = batchMap.get(chapter);
  if (batched) return batched;

  const offset = chapter - startChapter;
  if (offset < 0) return recurringStart; // startChapter 이전인데 batch에 없으면 recurring 시작일
  return new Date(recurringStart.getTime() + offset * intervalDays * DAY_MS);
}

/* ---------- public API ---------- */

export function isReleased(chapter: number, now: Date = new Date()): boolean {
  return now >= getReleaseDate(chapter);
}

export function getChapterStatus(chapter: number, now: Date = new Date()): ChapterStatus {
  const releaseDate = getReleaseDate(chapter);
  const released = now >= releaseDate;
  const isNew = released
    ? now.getTime() - releaseDate.getTime() < NEW_THRESHOLD_MS
    : false;
  return { chapter, released, releaseDate, isNew };
}

export function getReleasedChapters(allChapters: number[], now: Date = new Date()): number[] {
  return allChapters.filter((ch) => isReleased(ch, now));
}

export function getNextRelease(now: Date = new Date()): NextRelease | null {
  // recurring 규칙에서 다음 공개 화를 찾음 — batch는 이미 지난 것이므로 recurring만 탐색
  // 가장 빠른 미공개 recurring 화를 계산
  let ch = startChapter;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const date = getReleaseDate(ch);
    if (date > now) {
      const diffMs = date.getTime() - now.getTime();
      return {
        chapter: ch,
        releaseDate: date,
        daysLeft: Math.floor(diffMs / DAY_MS),
        hoursLeft: Math.floor((diffMs % DAY_MS) / (60 * 60 * 1000)),
      };
    }
    ch++;
    // 안전장치: 충분히 먼 미래까지 탐색
    if (ch > startChapter + 1000) return null;
  }
}

export function getAllChapterStatuses(allChapters: number[], now: Date = new Date()): ChapterStatus[] {
  return allChapters.map((ch) => getChapterStatus(ch, now));
}

/** 현재 시점 기준 공개된 화수 반환 (batch + recurring) */
export function getReleasedChapterCount(now: Date = new Date()): number {
  // batch 중 공개된 수
  let count = 0;
  for (const [, date] of batchMap) {
    if (now >= date) count++;
  }
  // recurring 중 공개된 수
  let ch = startChapter;
  while (now >= getReleaseDate(ch)) {
    count++;
    ch++;
    if (ch > startChapter + 1000) break;
  }
  return count;
}
