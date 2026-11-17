import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReaderShell from "@/components/reader-shell";
import { getSeriesByLatestChapter, chapterOf } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function ReadPage({params}:{params:Promise<{chapterId:string}>}) {
 const {chapterId}=await params;
 let item=null;
 try { item=await getSeriesByLatestChapter(decodeURIComponent(chapterId)); } catch { notFound(); }
 if(!item) notFound();
 return <ReaderShell title={item.title} chapter={chapterOf(item)} seriesId={item.manga_id}/>;
}
