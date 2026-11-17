import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { chapterOf, coverOf, getCatalog, type Series } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function Home() {
  let items: Series[] = [];
  let error = "";
  try { items = await getCatalog(); } catch (e) { error = e instanceof Error ? e.message : "Gagal memuat katalog."; }
  const featured = items.filter(x => x.is_recommended).slice(0, 6);
  const hero = featured[0] || items[0];
  const latest = items.slice(0, 18);
  return <main><SiteHeader/>
    <section className="hero shell">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>Find a story.<br/><em>Lose yourself.</em></h1>
        <p>One hub for the worlds you love. Explore manga, manhwa, and manhua — all in one place.</p>
        <div className="hero-actions"><Link className="btn-primary" href="/explore">Explore library <ArrowRight size={17}/></Link><span className="hero-caption"><Sparkles size={15}/> Curated for curious readers</span></div>
        <div className="hero-stats"><div><strong>{items.length.toLocaleString("id-ID") || "—"}</strong><span>Titles</span></div><div><strong>03</strong><span>Categories</span></div><div><strong>∞</strong><span>Worlds to explore</span></div></div>
      </div>
      <div className="hero-visual">
        {hero?.cover_image_url || hero?.cover_portrait_url ? <div className="hero-feature"><Image src={coverOf(hero)} alt={hero.title} fill priority unoptimized sizes="(max-width:700px) 60vw, 340px"/><div className="hero-feature-shade"/><div className="hero-feature-label"><span>FEATURED TITLE</span><strong>{hero.title}</strong><small>{chapterOf(hero)}</small></div></div> : <div className="hero-placeholder"><BookOpenMark/></div>}
        {items.slice(1,4).map((x,i)=><div className={`floating-cover floating-${i+1}`} key={x.manga_id}>{coverOf(x) && <Image src={coverOf(x)} alt={x.title} fill unoptimized sizes="110px"/>}</div>)}
        <div className="visual-orbit"/>
      </div>
    </section>
    <section className="content-section shell" id="latest"><div className="section-heading"><div><div className="eyebrow"><Flame size={14}/> FRESH FROM THE LIBRARY</div><h2>Recently updated</h2></div><Link className="view-all" href="/explore">View all titles <ArrowRight size={16}/></Link></div>
      {error ? <div className="notice"><strong>Database belum terhubung.</strong><p>{error} Tambahkan SUPABASE_ANON_KEY pada environment deployment.</p></div> : latest.length ? <div className="title-grid">{latest.map(x=><TitleCard key={x.manga_id} item={x}/>)}</div> : <div className="notice">Belum ada judul untuk ditampilkan.</div>}
    </section>
    {featured.length>1 && <section className="content-section shell"><div className="section-heading"><div><div className="eyebrow"><Sparkles size={14}/> HANDPICKED</div><h2>Recommended for you</h2></div></div><div className="title-grid">{featured.slice(1).map(x=><TitleCard key={x.manga_id} item={x}/>)}</div></section>}
    <SiteFooter/>
  </main>;
}
function BookOpenMark(){return <span>CHAPTER<br/>HUB</span>}
function TitleCard({item}:{item:Series}) {
  const cover=coverOf(item);
  return <Link href={`/series/${encodeURIComponent(item.manga_id)}`} className="title-card"><div className="poster">{cover ? <Image src={cover} alt={item.title} fill unoptimized sizes="(max-width:700px) 42vw,180px"/> : <div className="poster-fallback">{item.title.slice(0,1)}</div>}<span className="category-pill">{item.category || "series"}</span></div><div className="card-copy"><h3>{item.title}</h3><p>{chapterOf(item)} <span>·</span> {item.status || "Ongoing"}</p></div></Link>;
}
