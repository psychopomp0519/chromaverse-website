import fs from "fs";
import path from "path";
import { cache } from "react";

const CHAPTERS_DIR = path.join(process.cwd(), "src/content/novel/chapters");

export interface ChapterData {
  chapter: number;
  title: string;
  arc: number;
  volume: number;
  content: string;
  glossaryTerms: string[];
}

export const getChapter = cache((num: number): ChapterData | null => {
  const padded = String(num).padStart(3, "0");
  const filePath = path.join(CHAPTERS_DIR, `${padded}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
});

export function getAllChapterNumbers(): number[] {
  try {
    return fs
      .readdirSync(CHAPTERS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => parseInt(f.replace(".json", ""), 10))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export interface ChapterSummary {
  chapter: number;
  title: string;
  arc: number;
  volume: number;
  wordCount: number;
}

export function getAllChapterSummaries(): ChapterSummary[] {
  const nums = getAllChapterNumbers();
  return nums.map((num) => {
    const data = getChapter(num);
    if (!data) return { chapter: num, title: "", arc: 1, volume: 1, wordCount: 0 };
    return {
      chapter: data.chapter,
      title: data.title,
      arc: data.arc,
      volume: data.volume,
      wordCount: data.content.replace(/\s/g, "").length,
    };
  });
}
