"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Home, List, Play, Settings, X, BookOpen, Monitor, Moon } from "lucide-react";
import type { Chapter, ChapterPage } from "@/lib/chapters";
import { chapterLabel } from "@/lib/chapters";

export default function ReaderShell({title,chapter,seriesId,chapterId,pages,chapters}:{title:string;chapter:string;seriesId:string;chapterId:string;pages:ChapterPage[];chapters:Chapter[]}) {
 const [panel,setPanel]=useState<"settings"|"chapters"|null>(null);
 const [wide,setWide]=useState(false);
 const [dark,setDark]=useState(true);
 const orderedChapters=useMemo(()=>chapters, [chapters]);
 const currentIndex=orderedChapters.findIndex(item=>item.chapter_id===chapterId);
 const newer=currentIndex>0?orderedChapters[currentIndex-1]:null;
 const older=currentIndex>=0?orderedChapters[currentIndex+1]||null:null;
 const scroll=(direction:"up"|"down")=>window.scrollTo({top:direction==="up"?0:document.documentElement.scrollHeight,behavior:"smooth"});
 return <main className={`reader-page ${dark?"reader-dark":"reader-light"}`}>
  <header className="reader-topbar">
   <Link href={`/series/${encodeURIComponent(seriesId)}`} aria-label="Kembali"><ArrowLeft size={23}/></Link>
   <div className="reader-heading"><strong>{title}</strong><span>{chapter}</span></div>
   {newer?<Link href={`/read/${encodeURIComponent(newer.chapter_id)}`} aria-label="Chapter lebih baru"><ChevronRight size={24}/></Link>:<button aria-label="Chapter lebih baru" disabled><ChevronRight size={24}/></button>}
   <Link href="/" aria-label="Beranda"><Home size={25}/></Link>
  </header>
  <div className={`reader-content ${wide?"reader-wide":""}`}>
   <div className="reader-status"><BookOpen size={18}/><div><strong>Reader ChapterHub</strong><span>{pages.length? `${pages.length} halaman chapter` : "Halaman chapter belum diimpor"}</span></div></div>
   {pages.length>0 ? <section className="reader-pages" aria-label="Halaman chapter">
    {pages.map(page=><figure className="reader-page-image" key={page.id}>
      <img src={page.image_url} alt={`Halaman ${page.page_number}`} loading={page.page_number<=2?"eager":"lazy"}/>
    </figure>)}
   </section> : <section className="reader-empty">
    <div className="reader-empty-icon"><BookOpen size={34}/></div>
    <p className="reader-kicker">CHAPTER CONTENT</p>
    <h1>{chapter}</h1>
    <p>Data chapter sudah terhubung. Belum ada URL halaman di tabel chapter_pages untuk chapter ini.</p>
    <Link href={`/series/${encodeURIComponent(seriesId)}`} className="reader-back-link"><ArrowLeft size={16}/> Kembali ke detail manga</Link>
   </section>}
   <div className="reader-chapter-nav">
    {older?<Link href={`/read/${encodeURIComponent(older.chapter_id)}`}><ChevronLeft size={17}/> Chapter sebelumnya</Link>:<span/>}
    {newer?<Link href={`/read/${encodeURIComponent(newer.chapter_id)}`}>Chapter berikutnya <ChevronRight size={17}/></Link>:<span/>}
   </div>
   <div className="reader-endnote">ChapterHub · {chapter}</div>
  </div>
  <div className="reader-float-nav"><button onClick={()=>scroll("up")} aria-label="Ke atas"><ChevronUp/></button><button onClick={()=>scroll("down")} aria-label="Ke bawah"><ChevronDown/></button></div>
  <nav className="reader-toolbar">
   <Link href={`/series/${encodeURIComponent(seriesId)}`} aria-label="Kembali ke detail"><ChevronLeft/></Link>
   <button onClick={()=>setPanel(panel==="settings"?null:"settings")} aria-label="Pengaturan"><Settings/></button>
   <button aria-label="Gulir ke bawah" onClick={()=>scroll("down")}><Play fill="currentColor"/></button>
   <button onClick={()=>setPanel(panel==="chapters"?null:"chapters")} aria-label="Daftar chapter"><List/></button>
   <Link href="/" aria-label="Beranda"><Home/></Link>
  </nav>
  {panel&&<div className="reader-panel-backdrop" onClick={()=>setPanel(null)}><section className="reader-panel" onClick={e=>e.stopPropagation()}>
   <div className="reader-panel-head"><strong>{panel==="settings"?"Pengaturan reader":"Daftar chapter"}</strong><button onClick={()=>setPanel(null)} aria-label="Tutup"><X/></button></div>
   {panel==="settings"?<><button className="reader-setting-row" onClick={()=>setWide(!wide)}><Monitor size={18}/> Lebar konten <span>{wide?"Lebar":"Normal"}</span></button><button className="reader-setting-row" onClick={()=>setDark(!dark)}><Moon size={18}/> Tema <span>{dark?"Gelap":"Terang"}</span></button><p className="reader-panel-note">Pengaturan ini hanya mengubah tampilan reader.</p></>:<div className="reader-chapter-list">
    {orderedChapters.length?orderedChapters.map(item=><Link key={item.chapter_id} className={item.chapter_id===chapterId?"active":""} href={`/read/${encodeURIComponent(item.chapter_id)}`}>{chapterLabel(item)}</Link>):<p className="reader-panel-note">Belum ada daftar chapter untuk seri ini.</p>}
   </div>}
  </section></div>}
 </main>;
}
