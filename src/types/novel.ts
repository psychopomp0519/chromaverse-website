export interface NovelMeta {
  title: string;
  arcs: NovelArc[];
}

export interface NovelArc {
  id: number;
  title: string;
  chapters: string;
  volumes: NovelVolume[];
  keywords: string;
  synopsis: string;
}

export interface NovelVolume {
  id: number;
  title: string;
  chapters: [number, number];
}

export interface ChapterFrontmatter {
  chapter: number;
  title: string;
  arc: number;
  volume: number;
  wordCount: number;
  glossaryTerms: string[];
}

export interface Character {
  id: string;
  name: string;
  quote: string;
  race: string;
  chromaValues: {
    r: number;
    g: number;
    b: number;
    k?: number;
    total: number;
  };
  dominantColor: string;
  tier: string;
  iromon: string;
  role: string;
  personality: string;
  partyRole: string;
  spoilerAfter?: number;
  arcSummary: Record<number, string>;
}
