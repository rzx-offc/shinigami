#!/usr/bin/env node
/**
 * Import normalized chapter metadata/pages into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=https://PROJECT.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/import-chapters.mjs ./chapter-export.json
 *
 * Input format:
 * {
 *   "chapters": [{
 *     "chapter_id": "source-chapter-id",
 *     "manga_id": "existing-series-manga-id",
 *     "chapter_number": 12,
 *     "title": "Chapter 12",
 *     "source_url": "https://source.example/chapter/...",
 *     "published_at": "2026-11-17T00:00:00Z",
 *     "sort_order": 12,
 *     "pages": [
 *       { "page_number": 1, "image_url": "https://..." }
 *     ]
 *   }]
 * }
 *
 * This importer does not bypass login, CAPTCHA, Cloudflare, or other access
 * controls. Feed it data obtained through an authorized export/access method.
 */
import { readFile } from "node:fs/promises";

const inputPath = process.argv[2];
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!inputPath) {
  console.error("Usage: node scripts/import-chapters.mjs <chapter-export.json>");
  process.exit(1);
}
if (!supabaseUrl || !serviceKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment.");
  process.exit(1);
}

const payload = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(payload.chapters)) {
  throw new Error('Input JSON must contain a "chapters" array.');
}

async function upsert(table, rows, onConflict) {
  if (!rows.length) return;
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", onConflict);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(rows)
  });
  if (!response.ok) {
    throw new Error(`Supabase ${table} ${response.status}: ${await response.text()}`);
  }
}

for (const [index, chapter] of payload.chapters.entries()) {
  if (!chapter.chapter_id || !chapter.manga_id) {
    throw new Error(`Chapter at index ${index} needs chapter_id and manga_id.`);
  }
  const pages = Array.isArray(chapter.pages) ? chapter.pages : [];
  const chapterRow = {
    chapter_id: String(chapter.chapter_id),
    manga_id: String(chapter.manga_id),
    chapter_number: chapter.chapter_number ?? null,
    title: chapter.title ?? null,
    source_url: chapter.source_url ?? null,
    published_at: chapter.published_at ?? null,
    sort_order: chapter.sort_order ?? chapter.chapter_number ?? null
  };
  await upsert("chapters", [chapterRow], "chapter_id");

  const pageRows = pages.map((page, pageIndex) => {
    if (!page.image_url) throw new Error(`Missing image_url in ${chapter.chapter_id} page ${pageIndex + 1}`);
    return {
      chapter_id: String(chapter.chapter_id),
      page_number: Number(page.page_number ?? pageIndex + 1),
      image_url: String(page.image_url),
      width: page.width ?? null,
      height: page.height ?? null
    };
  });
  await upsert("chapter_pages", pageRows, "chapter_id,page_number");
  console.log(`Imported ${chapter.chapter_id}: ${pageRows.length} pages`);
}
console.log(`Done. Imported ${payload.chapters.length} chapters.`);
