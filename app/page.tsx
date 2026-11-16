import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function Home() {
  const all = getCatalog();
  const featured = all.slice(0, 12);
  const count = all.length;
  return (
    <main>
      <header className="topbar wrap">
        <Link className="brand" href="/"><span className="brand-mark">S</span><span>SHINIGAMI<span className="brand-dot">.</span></span></Link>
        <nav><Link href="/explore">Explore</Link><a href="#latest">Latest</a></nav>
        <Link className="search-link" href="/explore"><Search size={17}/><span>Search titles</span><kbd>/</kbd></Link>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> THE READING ROOM</div>
          <h1>Stories worth<br/><em>staying up for.</em></h1>
          <p>A considered library of manga, manhwa, and manhua. Find your next world to get lost in.</p>
          <div className="hero-actions"><Link className="button button-light" href="/explore">Explore library <ArrowUpRight size={16}/></Link><span className="quiet-note"><BookOpen size={15}/> Built for readers</span></div>
        </div>
        <div className="hero-art" aria-label="Featured manga covers">
          {featured.slice(0,3).map((item,i)=> <div className={`hero-cover cover-${i+1}`} key={item.id}>
            {item.cover ? <Image src={item.cover} alt={item.title} fill unoptimized sizes="(max-width: 700px) 30vw, 220px"/> : <div className="cover-placeholder">{item.title.slice(0,1)}</div>}
          </div>)}
          <div className="hero-index">01 / 03</div>
        </div>
      </section>

      <section className="library wrap" id="latest">
        <div className="section-head"><div><div className="eyebrow">YOUR NEXT READ</div><h2>Explore the library<span className="brand-dot">.</span></h2></div><Link className="text-link" href="/explore">View all <ArrowUpRight size={15}/></Link></div>
        {count ? <div className="series-grid">{featured.map(item=><Link href={`/series/${encodeURIComponent(String(item.id))}`} className="series-card" key={item.id}>
          <div className="poster">{item.cover ? <Image src={item.cover} alt={item.title} fill unoptimized sizes="(max-width: 700px) 45vw, 180px"/> : <div className="cover-placeholder">{item.title.slice(0,1)}</div>}<span className="type-tag">{String(item.type)}</span></div>
          <div className="series-meta"><h3>{item.title}</h3><p>{item.latest_chapter || item.status || String(item.type)}</p></div>
        </Link>)}</div> : <div className="empty-state"><Sparkles size={22}/><h3>Your library is ready for its catalog.</h3><p>Place <code>catalog_all.json</code> in the project root or <code>data/catalog_all.json</code>, then restart the app.</p></div>}
      </section>
      <footer className="footer wrap"><span>SHINIGAMI<span className="brand-dot">.</span></span><span>A quieter corner of the internet for stories.</span></footer>
    </main>
  );
}