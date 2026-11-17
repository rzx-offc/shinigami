export type TaxonomyItem = { name?: string; slug?: string };
export type Series = {
  manga_id: string; title: string; alternative_title?: string | null;
  cover_image_url?: string | null; cover_portrait_url?: string | null;
  description?: string | null; latest_chapter_id?: string | null;
  latest_chapter_number?: number | string | null; latest_chapter_time?: string | null;
  taxonomy?: Record<string, TaxonomyItem[]>; category?: string | null;
  status?: string | null; user_rate?: number | null; view_count?: number | null;
  release_year?: number | null; bookmark_count?: number | null; rank?: number | null;
  is_recommended?: boolean; country_id?: string | null;
};
const columns = "manga_id,title,alternative_title,cover_image_url,cover_portrait_url,description,latest_chapter_id,latest_chapter_number,latest_chapter_time,taxonomy,category,status,user_rate,view_count,release_year,bookmark_count,rank,is_recommended,country_id";
const baseUrl = process.env.SUPABASE_URL || "https://ejytejttooudazulhrxc.supabase.co";
const anonKey = process.env.SUPABASE_ANON_KEY;
async function request(path: string) {
  if (!anonKey) throw new Error("SUPABASE_ANON_KEY belum diatur.");
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: "application/json" },
    next: { revalidate: 60 }
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  return response.json();
}
export function coverOf(item: Series) {
  return item.cover_portrait_url || item.cover_image_url || "";
}
export function cleanDescription(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/\\([^\\w\\s])/g, "$1")
    .replace(/\\(?=\\s|$)/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}
export function chapterOf(item: Series) {
  return item.latest_chapter_number !== null && item.latest_chapter_number !== undefined
    ? `Chapter ${item.latest_chapter_number}` : "Chapter belum tersedia";
}
export async function getCatalog(): Promise<Series[]> {
  const all: Series[] = [];
  for (let offset = 0; offset < 5000; offset += 500) {
    const rows = await request(`series?select=${columns}&order=latest_chapter_time.desc.nullslast&limit=500&offset=${offset}`) as Series[];
    all.push(...rows);
    if (rows.length < 500) break;
  }
  return all;
}
export async function getSeries(id: string): Promise<Series | null> {
  const rows = await request(`series?select=${columns}&manga_id=eq.${encodeURIComponent(id)}&limit=1`) as Series[];
  return rows[0] || null;
}
export async function getSeriesByLatestChapter(chapterId: string): Promise<Series | null> {
  const rows = await request(`series?select=${columns}&latest_chapter_id=eq.${encodeURIComponent(chapterId)}&limit=1`) as Series[];
  return rows[0] || null;
}
