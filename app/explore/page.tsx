import { getCatalog } from "@/lib/catalog";
import ExploreClient from "./explore-client";
export const dynamic = "force-dynamic";
export default function ExplorePage() { return <ExploreClient items={getCatalog().map(({id,title,cover,type,status,latest_chapter})=>({id:String(id),title,cover:cover||"",type:type||"Manga",status:status||"",latest_chapter:latest_chapter||""}))}/>; }