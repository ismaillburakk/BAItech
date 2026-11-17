import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Panel" };

const MODULES = [
  { href: "/admin/projeler", title: "Projeler", description: "Proje kartları, detay sayfaları, sekmeli galeri, mağaza bağlantıları" },
  { href: "/admin/hizmetler", title: "Hizmetler", description: "Hizmet kartları, süreç metinleri, ana sayfa bento düzeni" },
  { href: "/admin/referanslar", title: "Referanslar", description: "Müşteri / referans logoları (Cloudinary yükleme)" },
  { href: "/admin/hero", title: "Hero", description: "Ana sayfa başlığı, butonlar, telefon yelpazesi" },
  { href: "/admin/ekip", title: "Ekip", description: "Hakkımızda ekip bölümü (opsiyonel)" },
  { href: "/admin/sss", title: "SSS", description: "Sıkça sorulan sorular + FAQPage şeması" },
  { href: "/admin/sayfalar", title: "Sayfalar", description: "Bölüm başlıkları, sayfa metinleri, yasal metinler, sayfa SEO'su" },
  { href: "/admin/site-ayarlari", title: "Site Ayarları", description: "Logo, iletişim, istatistikler, SEO/GEO varsayılanları" },
  { href: "/admin/gelen-kutusu", title: "Gelen Kutusu", description: "İletişim formundan gelen mesajlar" },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-zinc-900">Hoş geldiniz</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Sitedeki tüm metin ve görseller bu panelden yönetilir. Kaydettiğiniz değişiklikler birkaç saniye içinde sitede görünür.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-orange-400"
          >
            <h2 className="text-base font-semibold text-zinc-900">{m.title}</h2>
            <p className="mt-1.5 text-sm text-zinc-500">{m.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
