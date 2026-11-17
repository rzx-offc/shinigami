import Link from "next/link";
export default function SiteFooter() {
  return <footer className="site-footer shell"><Link className="footer-brand" href="/">CHAPTERHUB<span>®</span></Link><span>Discover your next story.</span><Link href="/explore">Browse library ↗</Link></footer>;
}
