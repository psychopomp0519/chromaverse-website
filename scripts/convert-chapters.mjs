import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import path from "path";

const ASSETS_DIR = path.resolve("project-assets/novel");
const OUTPUT_DIR = path.resolve("src/content/novel/chapters");

const GLOSSARY_TERMS = [
  "렌", "묵렌", "이로몬", "갸쿠몬", "이로쥬", "보쿠쥬",
  "코드", "그랜드 코드", "컨덕터", "디소넌스",
  "광명회", "심묵교", "균형파",
  "사이도", "스플릿", "탈색", "반전", "레스",
  "크로마튜너", "하쿠텐", "엔지", "세이지", "메이치", "코지", "시지", "아오치",
  "보더", "더 딥", "크로마스톰", "크로마 스크라이브",
  "루미나스", "쿠로겐", "프리즈마폴", "크로마싱크",
  "키하쿠", "메이사이", "츄사이", "탄사이", "보쿠에이",
  "아도르", "비탈리스", "코그니스", "서프레스", "이로드", "디스토트", "보이드",
  "산포", "잠재 현현", "크로마시프트", "크로마라",
];

function parseChapterFromFilename(filename) {
  const match = filename.match(/크로마버스_(\d+)화_(.+)\.md$/);
  if (!match) return null;
  return { chapter: parseInt(match[1], 10), title: match[2].replace(/_/g, " ") };
}

function getArc(chapter) {
  if (chapter <= 80) return 1;
  if (chapter <= 240) return 2;
  if (chapter <= 370) return 3;
  if (chapter <= 470) return 4;
  if (chapter <= 560) return 5;
  if (chapter <= 650) return 6;
  return 7;
}

function getVolume(chapter) {
  return Math.ceil(chapter / 20);
}

function findGlossaryTerms(content) {
  return GLOSSARY_TERMS.filter((term) => content.includes(term));
}

async function convertChapter(filePath, chapterInfo) {
  const content = (await readFile(filePath, "utf-8")).trim();
  const glossaryTerms = findGlossaryTerms(content);

  const json = {
    chapter: chapterInfo.chapter,
    title: chapterInfo.title,
    arc: getArc(chapterInfo.chapter),
    volume: getVolume(chapterInfo.chapter),
    content,
    glossaryTerms,
  };

  const outputFile = path.join(
    OUTPUT_DIR,
    String(chapterInfo.chapter).padStart(3, "0") + ".json"
  );
  await writeFile(outputFile, JSON.stringify(json, null, 2), "utf-8");

  console.log(
    `Chapter ${chapterInfo.chapter} (${chapterInfo.title}): ${content.length} chars, ${glossaryTerms.length} glossary terms`
  );
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(ASSETS_DIR))
    .filter((f) => f.endsWith(".md"))
    .sort();

  let count = 0;
  for (const f of files) {
    const info = parseChapterFromFilename(f);
    if (!info) {
      console.warn(`Skipping: ${f} (filename pattern mismatch)`);
      continue;
    }
    await convertChapter(path.join(ASSETS_DIR, f), info);
    count++;
  }

  console.log(`\nDone! ${count} chapters converted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
