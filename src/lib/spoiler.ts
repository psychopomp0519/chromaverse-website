import spoilerMap from "@/content/world/spoiler-map.json";
import type { SpoilerMap } from "@/types/world";

const map = spoilerMap as SpoilerMap;

export function isTermVisible(termId: string): boolean {
  const spoilerAfter = map.terms[termId];
  if (spoilerAfter === undefined) return true;
  return map.currentMaxChapter >= spoilerAfter;
}

export function isCharacterVisible(characterId: string): boolean {
  const spoilerAfter = map.characters[characterId];
  if (spoilerAfter === undefined) return true;
  return map.currentMaxChapter >= spoilerAfter;
}

export function getCurrentMaxChapter(): number {
  return map.currentMaxChapter;
}

export function getSectionSpoilers(sectionId: string) {
  return map.sections[sectionId] ?? [];
}
