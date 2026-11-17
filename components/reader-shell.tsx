"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Home, List, Play, Settings, X, BookOpen, Monitor, Moon } from "lucide-react";
export default function ReaderShell({title,chapter,seriesId}:{title:string;chapter:string;seriesId:string}) {
 const [panel,setPanel]=useState<"settings"|"chapters"|null>(null);
 const [wide,setWide]=useState(false);
 const [dark,setDark]=useState(true);
 const scroll=(direction:"up"|"down")=>window.scrollTo({top:direction==="up"?0:document.documentElement.scrollHeight,behavior:"smooth"});
 return <main className={`reader-page ${dark?"reader-dark":"reader-light"}`}>
  <header className="reader-topbar">
   <Link href={`/series/${encodeURIComponent(seriesId)}`} aria-label="Kembali"><ArrowLeft size={23}/></Link>
   <div className="reader-heading"><strong>{title}</strong><span>{chapter}</span></div>
   <button aria-label="Chapter berikutnya" disabled><ChevronRight size={24}/></button>
   <Link href="/" aria-label="Beranda"><Home size={25}/></Link>
  </header>
  <div className={`reader-content ${wide?"reader-wide":""}`}>
   <div className="reader-status"><BookOpen size={18}/><div><strong>Reader ChapterHub</strong><span>Mode tampilan siap · sumber halaman belum terhubung</span></div></div>
   <section className="reader-empty">
    <div className="reader-empty-icon"><BookOpen size={34}/></div>
    <p className="reader-kicker">CHAPTER CONTENT</p>
    <h1>{chapter}</h1>
    <p>Tampilan reader sudah disiapkan. Gambar halaman belum ditampilkan karena data chapter dan sumber gambar yang berizin belum tersedia di database.</p>
    <Link href={`/series/${encodeURIComponent(seriesId)}`} className="reader-back-link"><ArrowLeft size={16}/> Kembali ke detail manga</Link>
   </section>
   <div className="reader-endnote">Kamu sedang melihat kerangka reader, bukan halaman chapter asli.</div>
  </div>
  <div className="reader-float-nav"><button onClick={()=>scroll("up")} aria-label="Ke atas"><ChevronUp/></button><button onClick={()=>scroll("down")} aria-label="Ke bawah"><ChevronDown/></button></div>
  <nav className="reader-toolbar">
   <Link href={`/series/${encodeURIComponent(seriesId)}`} aria-label="Kembali ke detail"><ChevronLeft/></Link>
   <button onClick={()=>setPanel(panel==="settings"?null:"settings")} aria-label="Pengaturan"><Settings/></button>
   <button aria-label="Putar otomatis" onClick={()=>scroll("down")}><Play fill="currentColor"/></button>
   <button onClick={()=>setPanel(panel==="chapters"?null:"chapters")} aria-label="Daftar chapter"><List/></button>
   <Link href="/" aria-label="Beranda"><Home/></Link>
  </nav>
  {panel&&<div className="reader-panel-backdrop" onClick={()=>setPanel(null)}><section className="reader-panel" onClick={e=>e.stopPropagation()}>
   <div className="reader-panel-head"><strong>{panel==="settings"?"Pengaturan reader":"Daftar chapter"}</strong><button onClick={()=>setPanel(null)} aria-label="Tutup"><X/></button></div>
   {panel==="settings"?<><button className="reader-setting-row" onClick={()=>setWide(!wide)}><Monitor size={18}/> Lebar konten <span>{wide?"Lebar":"Normal"}</span></button><button className="reader-setting-row" onClick={()=>setDark(!dark)}><Moon size={18}/> Tema <span>{dark?"Gelap":"Terang"}</span></button><p className="reader-panel-note">Pengaturan ini hanya mengubah tampilan reader.</p></>:<p className="reader-panel-note">Daftar chapter belum tersedia. Database katalog saat ini hanya menyediakan ID chapter terbaru.</p>}
  </section></div>}
 </main>;
}
