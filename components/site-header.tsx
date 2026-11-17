import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
export default function SiteHeader() {
  return <header className="site-header shell">
    <Link className="brand" href="/"><span className="brand-symbol"><BookOpen size={19}/></span><span>CHAPTER<span>HUB</span></span></Link>
    <nav className="main-nav"><Link href="/">Home</Link><Link href="/explore">Explore</Link><a href="/#latest">Latest</a></nav>
    <Link className="header-search" href="/explore"><Search size={16}/><span>Search library</span></Link>
  </header>;
}
