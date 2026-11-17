import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import { SITE_URL } from "@/lib/seo";

import "./globals.css";

// Tasarım taslağı: Space Grotesk (başlık) + DM Sans (gövde); latin-ext → Türkçe karakterler
const display = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "BAI Technology",
  authors: [{ name: "BAI Technology", url: SITE_URL }],
  creator: "BAI Technology",
  publisher: "BAI Technology",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050b18",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`dark ${display.variable} ${body.variable}`}>
      <head>
        {/* JS kapalıyken (AI crawler / no-JS) reveal animasyonlu içerik görünür kalsın */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-dvh overflow-x-clip antialiased">{children}</body>
    </html>
  );
}
