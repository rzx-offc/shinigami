import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ExploreClient from "./explore-client";
import { getCatalog } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function ExplorePage() {
  let items = [];
  let error = "";
  try { items = await getCatalog(); } catch (e) { error = e instanceof Error ? e.message : "Gagal memuat katalog."; }
  const safe = items.map(x=>({id:x.manga_id,title:x.title,cover:x.cover_portrait_url||x.cover_image_url||"",type:x.category||"manga",status:x.status||"",chapter:x.latest_chapter_number==null?"":String(x.latest_chapter_number)}));
  return <main><SiteHeader/><section className="content-section shell explore-page"><div className="eyebrow">THE CHAPTERHUB COLLECTION</div><div className="section-heading explore-heading"><div><h1>Explore <em>stories.</em></h1><p>Find the next world worth getting lost in.</p></div><span className="result-count">{items.length.toLocaleString("id-ID")} TITLES</span></div>{error?<div className="notice">{error}</div>:<ExploreClient items={safe}/>}</section><SiteFooter/></main>;
}
