import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHINIGAMI — Manga Library",
  description: "A clean library for manga, manhwa, and manhua discovery."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}