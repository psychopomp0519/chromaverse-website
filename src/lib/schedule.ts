import scheduleData from "@/content/novel/release-schedule.json";

export interface ReleaseEntry {
  chapter: number;
  releaseDate: string;
}

export interface ReleaseSchedule {
  schedule: ReleaseEntry[];
  timezone: string;
}

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

const NEW_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3일

export function getSchedule(): ReleaseSchedule {
  return scheduleData as ReleaseSchedule;
}

function getReleaseDate(chapter: number): Date | null {
  const entry = scheduleData.schedule.find((e) => e.chapter === chapter);
  if (!entry) return null;
  return new Date(entry.releaseDate);
}

export function isReleased(chapter: number, now: Date = new Date()): boolean {
  const date = getReleaseDate(chapter);
  if (!date) return true; // 스케줄에 없는 챕터는 즉시 공개
  return now >= date;
}

export function getChapterStatus(chapter: number, now: Date = new Date()): ChapterStatus {
  const releaseDate = getReleaseDate(chapter);
  const released = releaseDate ? now >= releaseDate : true;
  const isNew = released && releaseDate
    ? now.getTime() - releaseDate.getTime() < NEW_THRESHOLD_MS
    : false;

  return { chapter, released, releaseDate, isNew };
}

export function getReleasedChapters(allChapters: number[], now: Date = new Date()): number[] {
  return allChapters.filter((ch) => isReleased(ch, now));
}

export function getNextRelease(now: Date = new Date()): NextRelease | null {
  const upcoming = scheduleData.schedule
    .map((e) => ({ chapter: e.chapter, releaseDate: new Date(e.releaseDate) }))
    .filter((e) => e.releaseDate > now)
    .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  const diffMs = next.releaseDate.getTime() - now.getTime();
  const daysLeft = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  return { chapter: next.chapter, releaseDate: next.releaseDate, daysLeft, hoursLeft };
}

export function getAllChapterStatuses(allChapters: number[], now: Date = new Date()): ChapterStatus[] {
  return allChapters.map((ch) => getChapterStatus(ch, now));
}

/** 현재 시점 기준 공개된 화수 반환 */
export function getReleasedChapterCount(now: Date = new Date()): number {
  return scheduleData.schedule.filter((e) => now >= new Date(e.releaseDate)).length;
}
