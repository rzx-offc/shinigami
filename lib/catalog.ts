import fs from "node:fs";
import path from "node:path";

export type Series = {
  id: string | number;
  title: string;
  slug?: string;
  cover?: string;
  image?: string;
  thumbnail?: string;
  type?: string;
  format?: string;
  status?: string;
  rating?: number | string;
  latest_chapter?: string;
  latestChapter?: string;
  synopsis?: string;
  description?: string;
  [key: string]: unknown;
};

function normalize(item: Record<string, unknown>, index: number): Series {
  const title = String(item.title ?? item.name ?? item.manga_name ?? "Untitled");
  return {
    ...item,
    id: String(item.id ?? item.manga_id ?? item.slug ?? index),
    title,
    slug: String(item.slug ?? item.id ?? item.manga_id ?? index),
    cover: String(item.cover ?? item.cover_url ?? item.image ?? item.thumbnail ?? item.poster ?? ""),
    type: String(item.type ?? item.format ?? item.category ?? "Manga"),
    status: String(item.status ?? ""),
    latest_chapter: String(item.latest_chapter ?? item.latestChapter ?? item.last_chapter ?? "")
  };
}

export function getCatalog(): Series[] {
  const configured = process.env.CATALOG_PATH || "./data/catalog_all.json";
  const candidates = [path.resolve(process.cwd(), configured), path.resolve(process.cwd(), "catalog_all.json")];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      const rows = Array.isArray(raw) ? raw : raw.data ?? raw.results ?? raw.items ?? [];
      if (Array.isArray(rows)) return rows.map((x, i) => normalize(x as Record<string, unknown>, i));
    } catch (error) {
      console.error("Catalog could not be read:", error);
    }
  }
  return [];
}
