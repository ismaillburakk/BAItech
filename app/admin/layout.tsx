import type { Metadata } from "next";

/**
 * /admin altındaki TÜM sayfaların (login dahil) ortak üst layout'u.
 * Yönetim arayüzü arama motorlarına kapalıdır; alt ağaç firebase-admin
 * (session doğrulama) kullanır → Node.js runtime.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { template: "%s — BAI Yönetim Paneli", default: "BAI Yönetim Paneli" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Panel açık tema kullanır (public site koyu); native form kontrolleri de açık çizilsin
  return (
    <div className="admin-root min-h-dvh bg-zinc-100 font-sans text-zinc-900" style={{ colorScheme: "light" }}>
      {children}
    </div>
  );
}
