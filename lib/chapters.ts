export type Chapter = {
  chapter_id: string;
  manga_id: string;
  chapter_number?: number | string | null;
  title?: string | null;
  source_url?: string | null;
  published_at?: string | null;
  sort_order?: number | null;
};
export type ChapterPage = {
  id: number;
  chapter_id: string;
  page_number: number;
  image_url: string;
  width?: number | null;
  height?: number | null;
};

const baseUrl = process.env.SUPABASE_URL || "https://zrrzshymjvwzxbabtkrw.supabase.co";
const anonKey = process.env.SUPABASE_ANON_KEY;

async function request(path: string) {
  if (!anonKey) throw new Error("SUPABASE_ANON_KEY belum diatur.");
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: "application/json" },
    next: { revalidate: 30 }
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function getChapter(chapterId: string): Promise<Chapter | null> {
  const rows = await request(`chapters?select=chapter_id,manga_id,chapter_number,title,source_url,published_at,sort_order&chapter_id=eq.${encodeURIComponent(chapterId)}&limit=1`) as Chapter[];
  return rows[0] || null;
}

export async function getChapterPages(chapterId: string): Promise<ChapterPage[]> {
  return await request(`chapter_pages?select=id,chapter_id,page_number,image_url,width,height&chapter_id=eq.${encodeURIComponent(chapterId)}&order=page_number.asc`) as ChapterPage[];
}

export async function getSeriesChapters(mangaId: string): Promise<Chapter[]> {
  return await request(`chapters?select=chapter_id,manga_id,chapter_number,title,sort_order&manga_id=eq.${encodeURIComponent(mangaId)}&order=sort_order.desc.nullslast&limit=500`) as Chapter[];
}

export function chapterLabel(chapter: Chapter) {
  return chapter.title || (chapter.chapter_number !== null && chapter.chapter_number !== undefined
    ? `Chapter ${chapter.chapter_number}` : "Chapter");
}
