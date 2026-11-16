# SHINIGAMI Reader

A custom dark editorial-style reading-library frontend built with Next.js 15, TypeScript, and CSS.

## Requirements
- Node.js 20.9+
- npm

## Setup
```bash
npm install
```

Put the catalog JSON exported by your own scraper at either:
- `data/catalog_all.json` (recommended), or
- `catalog_all.json` in the project root.

The catalog reader accepts a top-level array or an object containing a `data`, `results`, or `items` array. Each item should include an ID and title. Cover fields supported: `cover`, `cover_url`, `image`, `thumbnail`, or `poster`.

Run locally:
```bash
npm run dev
```

Build and start:
```bash
npm run build
npm start
```

## Current pages
- `/` Home
- `/explore` Search and category filters
- `/series/[id]` Series metadata page

Chapter/reader integration is intentionally not wired to a third-party content source yet. Connect only a source/API that you are authorized to display, or use content you own or have licensed. Do not mirror protected chapter images without permission.
