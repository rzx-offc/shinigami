# ChapterHub

ChapterHub is a Next.js 15 catalog and discovery website for manga, manhwa, and manhua metadata.

## Features
- Homepage with featured and recently updated titles
- Search and category filters
- Series detail pages
- Supabase REST integration for the `public.series` metadata table
- Responsive dark interface

## Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `SUPABASE_URL` and the project's public anon/publishable key as `SUPABASE_ANON_KEY`.
4. Ensure Row Level Security is enabled and the `anon` role has SELECT access to `public.series`.
5. Run `npm run dev` or deploy with `npm run build && npm start`.

Do not use a Supabase service-role/secret key in the website environment. The site only reads metadata; chapter pages/images must come from a source you are authorized to display.
