"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
type Item={id:string;title:string;cover:string;type:string;status:string;chapter:string};
export default function ExploreClient({items}:{items:Item[]}) {
 const [query,setQuery]=useState(""); const [type,setType]=useState("all");
 const types=["all","manga","manhwa","manhua"];
 const filtered=useMemo(()=>items.filter(x=>(type==="all"||x.type.toLowerCase()===type)&&x.title.toLowerCase().includes(query.trim().toLowerCase())),[items,query,type]);
 return <><div className="explore-controls"><label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search titles, series..." aria-label="Search titles"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search"><X size={16}/></button>}</label><div className="filter-row">{types.map(t=><button key={t} onClick={()=>setType(t)} className={type===t?"selected":""}>{t==="all"?"All titles":t}</button>)}</div></div><div className="results-line"><span>{filtered.length.toLocaleString("id-ID")} results</span><span>Sorted by latest update</span></div>{filtered.length?<div className="title-grid">{filtered.map(x=><Link href={`/series/${encodeURIComponent(x.id)}`} className="title-card" key={x.id}><div className="poster">{x.cover?<Image src={x.cover} alt={x.title} fill unoptimized sizes="(max-width:700px) 42vw,180px"/>:<div className="poster-fallback">{x.title.slice(0,1)}</div>}<span className="category-pill">{x.type}</span></div><div className="card-copy"><h3>{x.title}</h3><p>{x.chapter? `Chapter ${x.chapter}`:"Chapter unavailable"} <span>·</span> {x.status||"Unknown"}</p></div></Link>)}</div>:<div className="notice"><strong>No stories found.</strong><p>Try another title or category.</p></div>}</>;
}
