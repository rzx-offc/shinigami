import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ChapterHub — Discover Your Next Story",
  description: "Explore manga, manhwa, and manhua in one reading library.",
  applicationName: "ChapterHub"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
