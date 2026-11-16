import fs from "node:fs";
import path from "node:path";

type TaxonomyItem = { name?: string; slug?: string };

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
  latest_chapter_id?: string;
  latest_chapter_number?: number | string;
  latestChapter?: string;
  synopsis?: string;
  description?: string;
  taxonomy?: Record<string, TaxonomyItem[]>;
  [key: string]: unknown;
};

function firstTaxonomyName(value: unknown): string | undefined {
  if (! Array.isArray(value)) return undefined;
  const item = value.find((entry) => entry && typeof entry === "object") as TaxonomyItem | undefined;
  return item?.name;
}

function normalize(item: Record<string, unknown>, index: number): Series {
  const taxonomy = item.taxonomy && typeof item.taxonomy === "object"
    ? item.taxonomy as Record<string, TaxonomyItem[]>
    : {};
  const title = String(item.title ?? item.name ?? item.manga_name ?? "Untitled");
  const id = String(item.id ?? item.manga_id ?? item.slug ?? index);
  const format = firstTaxonomyName(taxonomy.Format)
    ?? String(item.format ?? item.type ?? item._category ?? item.category ?? "Manga");
  const chapterNumber = item.latest_chapter_number;
  const latestChapter = chapterNumber !== undefined && chapterNumber !== null && String(chapterNumber) !== ""
    ? `Chapter ${chapterNumber}`
    : String(item.latest_chapter ?? item.latestChapter ?? item.last_chapter ?? "");

  return {
    ...item,
    id,
    title,
    slug: String(item.slug ?? id),
    cover: String(
      item.cover_image_url ?? item.cover ?? item.cover_url ?? item.cover_portrait_url
      ?? item.image ?? item.thumbnail ?? item.poster ?? ""
    ),
    type: format,
    format,
    status: item.status === undefined || item.status === null ? "" : String(item.status),
    latest_chapter: latestChapter,
    latest_chapter_id: item.latest_chapter_id ? String(item.latest_chapter_id) : undefined,
    latest_chapter_number: chapterNumber as number | string | undefined,
    synopsis: String(item.description ?? item.synopsis ?? "")
  };
}

export function getCatalog(): Series[] {
  const configured = process.env.CATALOG_PATH || "./data/catalog_all.json";
  const candidates = [path.resolve(process.cwd(), configured), path.resolve(process.cwd(), "catalog_all.json")];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const raw: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
      const rows = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object"
          ? (raw as Record<string, unknown>).data
            ?? (raw as Record<string, unknown>).results
            ?? (raw as Record<string, unknown>).items
            ?? []
          : [];
      if (Array.isArray(rows)) {
        return rows
          .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
          .map(normalize);
      }
    } catch (error) {
      console.error("Catalog could not be read:", error);
    }
  }
  return [];
}
