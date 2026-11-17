import { notFound } from "next/navigation";
import ReaderShell from "@/components/reader-shell";
import { getSeries } from "@/lib/catalog";
import { chapterLabel, getChapter, getChapterPages, getSeriesChapters } from "@/lib/chapters";

export const dynamic = "force-dynamic";

export default async function ReadPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  let chapter = null;
  try {
    chapter = await getChapter(decodeURIComponent(chapterId));
  } catch {
    notFound();
  }
  if (!chapter) notFound();

  let series = null;
  let pages = [];
  let chapters = [];
  try {
    [series, pages, chapters] = await Promise.all([
      getSeries(chapter.manga_id),
      getChapterPages(chapter.chapter_id),
      getSeriesChapters(chapter.manga_id)
    ]);
  } catch {
    notFound();
  }
  if (!series) notFound();

  return (
    <ReaderShell
      title={series.title}
      chapter={chapterLabel(chapter)}
      seriesId={series.manga_id}
      chapterId={chapter.chapter_id}
      pages={pages}
      chapters={chapters}
    />
  );
}
