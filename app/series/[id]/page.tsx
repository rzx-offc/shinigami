import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const item = getCatalog().find((series) => String(series.id) === decodedId || String(series.slug) === decodedId);

  if (!item) notFound();

  const cover = item.cover || "";
  const synopsis = String(item.synopsis ?? item.description ?? "").trim() || "Sinopsis belum tersedia.";
  const latestChapter = String(item.latest_chapter || "").trim();
  const status = item.status ? `Status ${item.status}` : "Status unavailable";

  return (
    <main>
      <header className="topbar wrap">
        <Link className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>SHINIGAMI<span className="brand-dot">.</span></span>
        </Link>
        <Link className="text-link" href="/explore"><ArrowLeft size={15} /> Explore</Link>
      </header>

      <section className="detail wrap">
        <div className="detail-cover">
          {cover ? <Image src={cover} alt={item.title} fill unoptimized sizes="260px" /> : <div className="cover-placeholder">{item.title.slice(0, 1)}</div>}
        </div>
        <div className="detail-copy">
          <div className="eyebrow">{String(item.type || "MANGA").toUpperCase()}</div>
          <h1>{item.title}</h1>
          <div className="detail-tags">
            <span>{status}</span>
            <span>{String(item.type || "Series")}</span>
            {item.latest_chapter_number !== undefined && item.latest_chapter_number !== null
              ? <span>{latestChapter}</span>
              : null}
          </div>
          <p>{synopsis}</p>
          <div className="chapter-panel">
            <BookOpen size={18} />
            <div>
              <strong>Chapter list</strong>
              <p>{latestChapter ? `Metadata katalog mencatat rilisan terbaru: ${latestChapter}.` : "Metadata chapter belum tersedia di katalog."} Daftar baca akan dihubungkan setelah sumber chapter yang berizin siap.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer wrap">
        <span>SHINIGAMI<span className="brand-dot">.</span></span>
        <span>Read responsibly.</span>
      </footer>
    </main>
  );
}
