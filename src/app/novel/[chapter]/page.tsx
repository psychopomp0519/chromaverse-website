import { notFound } from "next/navigation";
import { getChapter, getAllChapterNumbers, getAvailableChapterNumbers } from "@/lib/content";
import { ReaderContent } from "./ReaderContent";
import { ChapterGate } from "@/components/novel/ChapterGate";

export function generateStaticParams() {
  return getAllChapterNumbers().map((ch) => ({
    chapter: String(ch),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterParam } = await params;
  const num = parseInt(chapterParam, 10);
  const chapter = getChapter(num);
  if (!chapter) return { title: "존재하지 않는 화" };
  return {
    title: `${chapter.chapter}화: ${chapter.title}`,
    description: `크로마버스 대막 ${chapter.arc}, ${chapter.volume}권. ${chapter.title}.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterParam } = await params;
  const num = parseInt(chapterParam, 10);
  const chapter = getChapter(num);
  if (!chapter) notFound();

  const allChapters = getAllChapterNumbers();
  const available = getAvailableChapterNumbers();
  const hasPrev = available.includes(num - 1);
  const hasNext = available.includes(num + 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <ChapterGate chapter={num}>
        <ReaderContent
          chapter={chapter}
          chapterNum={num}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </ChapterGate>
    </div>
  );
}
