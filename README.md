# ChapterHub

ChapterHub is a Next.js 15 catalog and reader shell for manga, manhwa, and manhua metadata.

## Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `SUPABASE_URL` and the project's public anon/publishable key as `SUPABASE_ANON_KEY`.
4. Ensure RLS allows `anon` SELECT on `public.series`, `public.chapters`, and `public.chapter_pages`.
5. Run `npm run dev` or deploy with `npm run build && npm start`.

## Chapter database
Run `supabase/migrations/001_chapter_tables.sql` in the Supabase SQL Editor.

- `chapters`: one row per chapter, linked to `series.manga_id`.
- `chapter_pages`: ordered image URL rows for each chapter.

## Import chapter data
The local importer accepts a normalized JSON export and writes it to Supabase:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_KEY \
node scripts/import-chapters.mjs ./chapter-export.json
```

See `scripts/chapter-export.example.json` for the expected structure. Keep the service-role key local; never put it in browser code or public Vercel variables.

The importer does not bypass login, CAPTCHA, Cloudflare, or other access controls. Connect a source adapter only through an authorized access/export method.
