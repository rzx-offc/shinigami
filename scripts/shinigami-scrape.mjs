#!/usr/bin/env node
/**
 * Fetch and parse a publicly accessible Shinigami chapter page using Node.js.
 *
 * Usage:
 *   node scripts/shinigami-scrape.mjs <chapter_url> <manga_id> [chapter_number]
 *
 * This uses ordinary HTTP access only. It intentionally stops on HTTP 403,
 * CAPTCHA, Cloudflare challenges, or login walls; it does not evade them.
 */
import { writeFile } from "node:fs/promises";

const [chapterUrl, mangaId, chapterNumberArg] = process.argv.slice(2);
if (!chapterUrl || !mangaId) {
  console.error("Usage: node scripts/shinigami-scrape.mjs <chapter_url> <manga_id> [chapter_number]");
  process.exit(1);
}

const parsedUrl = new URL(chapterUrl);
if (!/^(www\.)?shinigami\.asia$/i.test(parsedUrl.hostname) && !/^\d+\.shinigami\.asia$/i.test(parsedUrl.hostname)) {
  throw new Error("URL harus berasal dari domain Shinigami.");
}
const chapterId = parsedUrl.pathname.match(/\/chapter\/([^/?#]+)/)?.[1];
if (!chapterId) throw new Error("URL tidak memuat ID chapter.");

const response = await fetch(chapterUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36",
    "Accept": "text/html,application/xhtml+xml"
  },
  redirect: "follow"
});

if (response.status === 403 || response.status === 429) {
  console.error(`Shinigami menolak akses otomatis (HTTP ${response.status}).`);
  console.error("Script berhenti di sini; gunakan API/ekspor resmi atau minta akses integrasi dari pengelola situs.");
  process.exit(2);
}
if (!response.ok) {
  console.error(`Request gagal: HTTP ${response.status}`);
  process.exit(2);
}

const html = await response.text();
if (/just a moment|cf-chl-|cloudflare/i.test(html.slice(0, 12000))) {
  console.error("Respons berisi halaman proteksi, bukan konten chapter. Tidak mencoba melewatinya.");
  process.exit(2);
}

const urls = new Set();
const add = value => {
  if (!value) return;
  const cleaned = value.trim().replaceAll("&amp;", "&").replaceAll("\\/", "/");
  if (/^(data:|blob:|javascript:)/i.test(cleaned)) return;
  try {
    const absolute = new URL(cleaned, chapterUrl).href;
    if (/^https?:\/\//i.test(absolute) && /\.(jpg|jpeg|png|webp|avif)(?:[?#]|$)/i.test(absolute)) urls.add(absolute);
  } catch {}
};

for (const tagMatch of html.matchAll(/<img\b[^>]*>/gi)) {
  const tag = tagMatch[0];
  for (const attr of ["src", "data-src", "data-original", "data-lazy-src", "data-url"]) {
    const match = tag.match(new RegExp("\\b" + attr + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
    if (match?.[2]) add(match[2]);
  }
  const srcset = tag.match(/\bsrcset\s*=\s*(["'])(.*?)\1/i)?.[2];
  if (srcset) for (const entry of srcset.split(",")) add(entry.trim().split(/\s+/)[0]);
}

if (!urls.size) {
  console.error("Halaman berhasil diambil, tetapi HTML tidak berisi URL gambar chapter.");
  console.error("Kemungkinan konten dimuat oleh JavaScript/API setelah halaman dibuka.");
  console.error("Perlu dokumentasi API atau ekspor resmi dari pengelola situs; script tidak menebak endpoint.");
  process.exit(3);
}

const chapterNumber = chapterNumberArg === undefined ? null : Number(chapterNumberArg);
if (chapterNumber !== null && !Number.isFinite(chapterNumber)) throw new Error("Nomor chapter harus angka.");

const output = {
  chapters: [{
    chapter_id: chapterId,
    manga_id: mangaId,
    chapter_number: chapterNumber,
    title: chapterNumber === null ? null : `Chapter ${chapterNumber}`,
    source_url: chapterUrl,
    sort_order: chapterNumber,
    pages: [...urls].map((image_url, index) => ({ page_number: index + 1, image_url }))
  }]
};

await writeFile("chapter-export.json", JSON.stringify(output, null, 2) + "\n");
console.log(`Berhasil menemukan ${urls.size} gambar.`);
console.log("Hasil: chapter-export.json");
