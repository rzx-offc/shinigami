import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Bookmark, Eye, Play } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSeries, coverOf, chapterOf, cleanDescription } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function SeriesPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; let item=null;
 try { item=await getSeries(decodeURIComponent(id)); } catch { notFound(); }
 if(!item) notFound();
 const cover=coverOf(item);
 const genres=item.taxonomy?.Genre?.map(x=>x.name).filter(Boolean)||[];
 const synopsis=cleanDescription(item.description);
 return <main><SiteHeader/><section className="detail-shell shell"><Link href="/explore" className="back-link"><ArrowLeft size={16}/> Back to explore</Link><div className="detail-layout"><div className="detail-poster">{cover?<Image src={cover} alt={item.title} fill priority unoptimized sizes="(max-width:700px) 38vw,300px"/>:<div className="poster-fallback">{item.title.slice(0,1)}</div>}</div><div className="detail-info"><div className="eyebrow">{(item.category||"SERIES").toUpperCase()} {item.release_year? `· ${item.release_year}`:""}</div><h1>{item.title}</h1>{item.alternative_title&&<p className="alt-title">{item.alternative_title}</p>}<div className="detail-badges"><span>{item.status||"Status unknown"}</span><span>{chapterOf(item)}</span></div><p className="synopsis">{synopsis||"Sinopsis belum tersedia."}</p>{genres.length>0&&<div className="genre-list">{genres.map(g=><span key={g}>{g}</span>)}</div>}<div className="detail-stats"><div><Eye size={16}/><strong>{Number(item.view_count||0).toLocaleString("id-ID")}</strong><small>Views</small></div><div><Bookmark size={16}/><strong>{Number(item.bookmark_count||0).toLocaleString("id-ID")}</strong><small>Bookmarks</small></div></div>{item.latest_chapter_id ? <Link className="reader-launch" href={`/read/${encodeURIComponent(item.latest_chapter_id)}`}><Play size={17} fill="currentColor"/> Buka reader <span>{chapterOf(item)}</span></Link> : <div className="chapter-info"><BookOpen size={19}/><div><strong>Chapter belum tersedia</strong><p>Belum ada ID chapter terbaru pada data katalog.</p></div></div>}</div></div></section><SiteFooter/></main>;
}
