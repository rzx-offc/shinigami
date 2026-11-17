#!/usr/bin/env node
/**
 * Extract chapter image URLs from a locally saved, normally accessible reader page.
 *
 * Usage:
 *   node scripts/extract-chapter.mjs ./read.html <manga_id> <chapter_id> <chapter_number> [source_url]
 *
 * This only parses a local file supplied by the user. It does not connect to
 * Shinigami, evade Cloudflare/CAPTCHA, read browser cookies, or access accounts.
 */
import { readFile, writeFile } from "node:fs/promises";

const [inputPath, mangaId, chapterId, chapterNumberArg, sourceUrl = ""] = process.argv.slice(2);
if (!inputPath || !mangaId || !chapterId) {
  console.error("Usage: node scripts/extract-chapter.mjs <saved-page.html> <manga_id> <chapter_id> <chapter_number> [source_url]");
  process.exit(1);
}

const html = await readFile(inputPath, "utf8");
const chapterNumber = chapterNumberArg === undefined || chapterNumberArg === ""
  ? null
  : Number(chapterNumberArg);
if (chapterNumber !== null && !Number.isFinite(chapterNumber)) {
  throw new Error("chapter_number harus berupa angka.");
}

const base = sourceUrl ? new URL(sourceUrl) : null;
const candidates = new Set();

function addCandidate(raw) {
  if (!raw) return;
  const value = raw.trim().replaceAll("&amp;", "&");
  if (!value || /^(data:|blob:|javascript:)/i.test(value)) return;
  try {
    const url = base ? new URL(value, base).href : new URL(value).href;
    if (/^https?:\/\//i.test(url)) candidates.add(url);
  } catch {
    // Ignore non-URL values.
  }
}

for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
  const tag = match[0];
  for (const attr of ["src", "data-src", "data-original", "data-lazy-src", "data-url"]) {
    const re = new RegExp("\\b" + attr + "\\s*=\\s*([\"'])(.*?)\\1", "i");
    const value = tag.match(re)?.[2];
    if (value) addCandidate(value);
  }
  const srcset = tag.match(/\bsrcset\s*=\s*(["'])(.*?)\1/i)?.[2];
  if (srcset) {
    for (const item of srcset.split(",")) addCandidate(item.trim().split(/\s+/)[0]);
  }
}

// Some reader pages serialize page URLs in inline JSON instead of img tags.
for (const match of html.matchAll(/https?:\\?\/\\?\/[^"'\\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\\s<>]*)?/gi)) {
  addCandidate(match[0].replaceAll("\\/", "/").replaceAll("\\u0026", "&"));
}

const images = [...candidates].filter(url => /\.(?:jpg|jpeg|png|webp|avif)(?:[?#]|$)/i.test(url));
if (!images.length) {
  console.error("Tidak ada URL gambar yang bisa diekstrak dari HTML lokal.");
  console.error("Kemungkinan halaman tersimpan hanya berisi kerangka aplikasi; gunakan metode ekspor resmi dari sumber.");
  process.exit(2);
}

const payload = {
  chapters: [{
    chapter_id: String(chapterId),
    manga_id: String(mangaId),
    chapter_number: chapterNumber,
    title: chapterNumber === null ? null : `Chapter ${chapterNumber}`,
    source_url: sourceUrl || null,
    sort_order: chapterNumber,
    pages: images.map((image_url, index) => ({ page_number: index + 1, image_url }))
  }]
};

const outputPath = "chapter-export.json";
await writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n");
console.log(`Ditemukan ${images.length} URL gambar.`);
console.log(`Export tersimpan: ${outputPath}`);
console.log("Periksa chapter-export.json sebelum mengimpornya ke Supabase.");
