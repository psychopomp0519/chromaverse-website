export type GlossaryCategory =
  | "신화" | "종족" | "신체" | "생물" | "사회"
  | "종교" | "성장" | "경제" | "지리" | "전투";

export interface GlossaryEntry {
  id: string;
  term: string;
  kanji: string;
  category: GlossaryCategory;
  shortDesc: string;
  fullDesc: string;
  relatedTerms: string[];
  spoilerAfter?: number;
}

export interface WorldRegion {
  id: string;
  name: string;
  kanji: string;
  group: "center" | "primary" | "blend" | "border" | "deep";
  color: string;
  description: string;
  characteristics: string;
  dominantChannel?: string;
  saturationRange?: string;
}

export interface HistoryEvent {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  description: string;
  inNovel: boolean;
  gameVisibility: string;
  spoilerAfter?: number;
}

export interface PowerChannel {
  id: string;
  system: "rgb" | "cmyk";
  name: string;
  kanji: string;
  domain: string;
  physicalBasis: string;
  counterpart?: string;
  ranges: PowerRange[];
}

export interface PowerRange {
  min: number;
  max: number;
  description: string;
}

export interface SocialTier {
  id: string;
  system: "rgb" | "cmyk";
  name: string;
  kanji: string;
  totalRange: string;
  socialPosition: string;
  lifespan: string;
  notes: string;
}

export interface SpoilerMap {
  currentMaxChapter: number;
  terms: Record<string, number>;
  characters: Record<string, number>;
  sections: Record<string, SpoilerSection[]>;
}

export interface SpoilerSection {
  contentId: string;
  visibleAfter: number;
  placeholder: string;
}
